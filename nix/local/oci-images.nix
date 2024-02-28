let
  inherit (inputs.std.lib.ops) mkStandardOCI;
  tag = "1.0.0";
in {
  staging = mkStandardOCI {
    name = "331395006893.dkr.ecr.ap-southeast-1.amazonaws.com/staging-crypto-com-crypto-gpt-discord-service";
    operable = cell.operables.default;
    inherit tag;
  };
  production = mkStandardOCI {
    name = "640671260559.dkr.ecr.ap-southeast-1.amazonaws.com/prod-crypto-com-crypto-gpt-discord-service";
    operable = cell.operables.default;
    inherit tag;
  };
}
