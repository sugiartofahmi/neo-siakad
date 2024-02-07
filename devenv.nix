{ pkgs, ... }:

{
  env.GREET = "Welcome To Neo-Siakad Dev Environment!";

  packages = with pkgs; [ bun nodejs ];

  scripts.hello.exec = "echo $GREET";

  enterShell = ''
    hello
  '';

  dotenv.enable = true;

  languages.nix.enable = true;

  languages.typescript.enable = true;
}
