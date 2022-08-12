cmd_Release/lyra2.node := ln -f "Release/obj.target/lyra2.node" "Release/lyra2.node" 2>/dev/null || (rm -rf "Release/lyra2.node" && cp -af "Release/obj.target/lyra2.node" "Release/lyra2.node")
