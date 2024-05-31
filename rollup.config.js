import typescript from 'rollup-plugin-typescript2';

export default args => {
  const result = args.configDefaultConfig;
  console.warn("Custom roll up");
  return result.map(config => {
    config.plugins = [
      ...plugins,
      typescript({
	clean: true
      })
    ];
    return config;
  });
};

