export const getScrollY = (): number => {
  let scrOfY = 0;

  if (typeof window.pageYOffset == 'number') {
    scrOfY = window.pageYOffset;
  } else if (document.body && document.body.scrollTop) {
    scrOfY = document.body.scrollTop;
  } else if (document.documentElement && document.documentElement.scrollTop) {
    scrOfY = document.documentElement.scrollTop;
  }

  return scrOfY;
};

export const getDocHeight = (): number => {
  const D = document;

  return Math.max(
    D.body.scrollHeight,
    D.documentElement.scrollHeight,
    D.body.offsetHeight,
    D.documentElement.offsetHeight,
    D.body.clientHeight,
    D.documentElement.clientHeight
  );
};
