export default () => {
  const createdAt = new Date();
  return `${
    String(createdAt.getDay()).length === 1
      ? `0${createdAt.getDay()}`
      : createdAt.getDay()
  }-${
    String(createdAt.getMonth()).length === 1
      ? `0${createdAt.getMonth()}`
      : createdAt.getMonth()
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
