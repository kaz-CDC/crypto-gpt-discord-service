let
  inherit (inputs) nixpkgs;
  inherit (inputs.std.lib.ops) mkOperable;
in {
  default = mkOperable rec {
    runtimeInputs = with nixpkgs; [bashInteractive coreutils nodejs];
    package = cell.packages.default;
    runtimeScript = ''
      node ${package}/dist
    '';
  };
}
