# ansible-node-module
[![Build Status](https://travis-ci.org/gdelafosse/ansible-node-module.svg?branch=master)](https://travis-ci.org/gdelafosse/ansible-node-module)
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

*WARNING :* The _ansible_node_module_ package must be located in _<home>/.ansible/node_modules_.

Eventually run your playbook :
```
ansible-playbook your-playbook.yml
```

## Features

#### Returning JSON object

Your callback just have to return a JSON object. _ansible-node-module_ will print it in the standard output as the ansible process expects.
If your callback returns nothing, an empty object is returned.
```
ansible.main(() => {
    return {content: 'any content'};
});
```

#### Returning errors

If your callback throws an exception, _ansible-node-module_ will print an object JSON containing the flag _failed_ set to true and a _msg_ field containing the message of your error.
```
ansible.main(() => {
    throw new Error('your error');
});
```

#### Using arguments

Your callback can access the arguments set in the playbook, by declaring one parameter in its signature. Then each argument is accessible as a field of this parameter.
For example, in the playbook :
```

---

- hosts: localhost
  connection: local
  tasks:
    - your-module: arg1=value arg2=value2
```
then arg1 and arg2 will be accessible this way :
```
ansible.main((args) => {
    args.arg1 ...
    args.arg2 ...
});
```

#### Using dependencies

If your script uses other npm package they must be installed in _<home>/.ansible/node_modules_.
This is also true for _ansible-node-module_.
