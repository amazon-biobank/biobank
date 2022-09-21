{
   "targets": [
       {
           "target_name": "lyra2",
           "sources": [
               "./encryptCertificate/lyra2/Lyra2.cc",
               "./encryptCertificate/lyra2/LyraHash.cc",
               "./encryptCertificate/lyra2/Sponge.cc",
               "./encryptCertificate/lyra2/lyra2-addon.cc"
            ],
           "include_dirs": [
               "./node_modules/node-addon-api"
           ]
       }
   ]
}