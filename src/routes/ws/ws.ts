import { WebSocket } from 'ws';
import db from '../../utils/db';

export default (ws: WebSocket) => {
  let token = '';

  setTimeout(() => {
    if (!token) {
      ws.send(
        JSON.stringify({
          message: 'Timed out waiting for authorization',
          payload: null,
        }),
      );
      ws.terminate();
    }
  }, 3000);

  ws.on('message', async (data) => {
    try {
      const commandBody = JSON.parse(data.toString('utf-8'));

      if (!commandBody.command) {
        ws.send(
          JSON.stringify({
            message: 'Invalid command body',
            payload: null,
          }),
        );
        return;
      }
      if (!commandBody.arguments) {
        ws.send(
          JSON.stringify({
            message: 'Invalid command body',
            payload: null,
          }),
        );
        return;
      }

      if (commandBody.command === 'authorize') {
        if (token) {
          ws.send(
            JSON.stringify({
              message: 'Already authorized',
              payload: null,
            }),
          );
          return;
        }

        if (!commandBody.arguments.token) {
          ws.send(
            JSON.stringify({
              message: 'token is required in the arguments',
              payload: null,
            }),
          );
          return;
        }

        const user = await db.user.findFirst({
          where: {
            token: String(commandBody.arguments.token),
          },
        });

        if (!user) {
          ws.send(
            JSON.stringify({
              message: 'Invalid token',
              payload: null,
            }),
          );
          return;
        }

        token = String(commandBody.arguments.token);

        return;
      }

      if (commandBody.command === 'open channel') {
        if (!commandBody.arguments.id) {
          ws.send(
            JSON.stringify({
              message: 'id is required in the arguments',
              payload: null,
            }),
          );
          return;
        }

        const channel = await db.channel.findFirst({
          where: {
            id: String(commandBody.arguments.id),
          },
        });

        if (!channel) {
          ws.send(
            JSON.stringify({
              message: 'Invalid id',
              payload: null,
            }),
          );
          return;
        }

        ws.on('message', () => {});

        let lastMessageInChannel = await db.message.findMany({
          where: {
            channelId: channel.id,
          },
          select: {
            id: true,
            sender: {
              select: {
                id: true,
                username: true,
                tag: true,
                badges: true,
                createdAt: true,
              },
            },
            content: true,
            sentAt: true,
          },
          take: -1,
        });

        if (lastMessageInChannel.length === 0) {
          while (
            (
              await db.message.findMany({
                where: {
                  channelId: channel.id,
                },
                select: {
                  id: true,
                  sender: {
                    select: {
                      id: true,
                      username: true,
                      tag: true,
                      badges: true,
                      createdAt: true,
                    },
                  },
                  content: true,
                  sentAt: true,
                },
                take: -1,
              })
            ).length === 0
          );
          lastMessageInChannel = await db.message.findMany({
            where: {
              channelId: channel.id,
            },
            select: {
              id: true,
              sender: {
                select: {
                  id: true,
                  username: true,
                  tag: true,
                  badges: true,
                  createdAt: true,
                },
              },
              content: true,
              sentAt: true,
            },
            take: -1,
          });
        }

        while (true)
          if (
            (
              await db.message.findMany({
                where: {
                  channelId: channel.id,
                },
                take: -1,
              })
            )[0].id !== lastMessageInChannel[0].id
          ) {
            lastMessageInChannel = await db.message.findMany({
              where: {
                channelId: channel.id,
              },
              select: {
                id: true,
                sender: {
                  select: {
                    id: true,
                    username: true,
                    tag: true,
                    badges: true,
                    createdAt: true,
                  },
                },
                content: true,
                sentAt: true,
              },
              take: -1,
            });
            ws.send(
              JSON.stringify({
                message: 'New message',
                payload: lastMessageInChannel,
              }),
            );
          }
      }
    } catch {
      ws.send(
        JSON.stringify({
          message: 'Invalid command body',
          payload: null,
        }),
      );
    }
  });
};
