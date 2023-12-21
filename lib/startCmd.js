const cmd = (options, callback) => {
  const { pattern, alias, react } = options;
  const forMe = options.forMe !== false; 

  return {
      pattern,
      forMe,
      alias,
      react,
      run: callback,
  };
};

module.exports = { cmd };