# Monorepo

### init package.json
```
pnpm init
```

### config .npmrc
```
shamefully-hoist = true
```

### config pnpm.workspace.yaml
```
packages:
  - "packages/**"
  - "projects/**"
```

### install package
```
// install in all project
pnpm add <package> -w

// install in specific project
pnpm add <package> --filter <project_name>
```
