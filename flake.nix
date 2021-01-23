{
  description = "Trident is a Discord bot made in TypeScript using discord-akairo";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let pkgs = nixpkgs.legacyPackages.${system}; in {
      devShell = import ./shell.nix { inherit pkgs; };
    }
  );
}
