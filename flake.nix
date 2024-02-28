{
  inputs.n2c.url = "github:nlewo/nix2container";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  inputs.std.url = "github:divnix/std";

  inputs.std.inputs.n2c.url = "github:nlewo/nix2container";

  outputs = {
    self,
    std,
    ...
  } @ inputs:
    std.growOn {
      inherit inputs;
      cellsFrom = ./nix;
      cellBlocks = with std.blockTypes; [
        (containers "oci-images" {ci.publish = true;})
        (installables "packages" {ci.build = true;})
        (runnables "operables")
      ];
    } {
      packages = std.harvest self ["local" "packages"];
    };
}
