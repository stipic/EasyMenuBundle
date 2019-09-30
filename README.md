# Installation

```
$ composer require stipic/easy-menu-bundle
```

# Configuration

routes.yaml

```
menu_builder:
    resource: "@StipicEasyMenuBundle/Resources/config/routing.yml"
```

config/packages/easy_admin.yaml

```
imports:
    resource: "@StipicEasyMenuBundle/Resources/config/easy_admin.yaml"
```

Update schema:

```
$ bin/console d:s:u --force
```

# Credits

https://github.com/dbushell/Nestable