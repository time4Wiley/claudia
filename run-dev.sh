#!/bin/bash

# Set Rust mirrors for China
export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
export CARGO_REGISTRIES_CRATES_IO_INDEX=sparse+https://mirrors.ustc.edu.cn/crates.io-index/

# Set npm registry for China
export BUN_CONFIG_REGISTRY=https://registry.npmmirror.com

# Run Tauri dev
cd /Users/wei/Projects/claudia
bun run tauri dev