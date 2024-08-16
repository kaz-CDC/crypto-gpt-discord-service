{
  default = inputs.nixpkgs.buildNpmPackage {
    pname = "crypto-gpt-discord-service";
    version = "1.2.0";

    src = inputs.self + /.;

    npmDepsHash = "sha256-MzjNc6si80a1zDdO7Yh/i4reYkd3o9twkDZwnkMPjTU=";

    npmPackFlags = ["--ignore-scripts"];

    NODE_OPTIONS = "--openssl-legacy-provider";

    installPhase = ''
      mkdir $out
      cp -R dist $out
      cp -R node_modules $out
      cp package.json $out
      substituteInPlace $out/package.json --replace '"prestart": "npm run build",' ""
    '';
  };
}
