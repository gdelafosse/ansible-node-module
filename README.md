# ansible-node-module
A library that helps developing Ansible module in javascript.

## Usage

Create a javascript file with the node shebang :

```
#! node
```

Import _the ansible-node-module_ :

```
const ansible = require('ansible-node-module');
```

Call _ansible.main_ passing a callback containing your logic :

```
ansible.main(() => {
    // TO DO
});
```

Use your module in playbooks. For example if your script is called _your-module.js_, put it in a _library_ folder located near your playbook.

```

---

- hosts: localhost
  connection: local
  tasks:
    - your-module:
```

*WARNING :* The _ansible_node_module_ package must be located in _<home>/.ansible/tmp/node_modules_.

Eventually run your playbook :
```
ansible-playbook your-playbook.yml
```