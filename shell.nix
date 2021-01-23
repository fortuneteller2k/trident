{ pkgs ? import <nixpkgs> { } }:

with pkgs;
mkShell {
  buildInputs = [
    nodePackages.npm
    nodePackages.typescript
    nodejs
  ];
}
