declare var grecaptcha: {
  execute(siteKey: string, options: { action: string }): Promise<string>;
  ready(callback: () => void): void;
};
