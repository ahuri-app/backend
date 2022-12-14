export default () => {
  const createdAt = new Date();
  return `${
    String(createdAt.getDate()).length === 1
      ? `0${createdAt.getDate()}`
      : createdAt.getDate()
  }-${
    String(createdAt.getMonth() + 1).length === 1
      ? `0${createdAt.getMonth() + 1}`
      : createdAt.getMonth() + 1
  }-${
    String(createdAt.getFullYear()).length === 1
      ? `0${createdAt.getFullYear()}`
      : createdAt.getFullYear()
  } ${
    String(createdAt.getHours()).length === 1
      ? `0${createdAt.getHours()}`
      : createdAt.getHours()
  }:${
    String(createdAt.getMinutes()).length === 1
      ? `0${createdAt.getMinutes()}`
      : createdAt.getMinutes()
  }:${
    String(createdAt.getSeconds()).length === 1
      ? `0${createdAt.getSeconds()}`
      : createdAt.getSeconds()
  }`;
};
