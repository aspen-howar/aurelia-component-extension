## Unified Aurelia Components Extension

这是针对Unified项目的扩展，主要是集中在html方面，旨在开发过程中提供一些便利功能。

### 问题1

每次在html文件中添加Aurelia组件时，都需要手动添加同名的html，less和ts文件。


### 解决方案

* 添加了一些菜单项

| 名称 | 描述 |
|------|------|
| `New Aurelia Component` | 在当前文件夹下创建一个新的Aurelia组件，包含html, less和ts文件，并且提供了简单的模板 |
| `New Aurelia Component Folder` | 在当前文件夹下创建一个新的文件夹，然后在其中创建一个新的Aurelia组件，包含html, less和ts文件，并且提供了简单的模板 |
| `Delete Aurelia Component` | 删除整个Aurelia组件，而不只是当前文件 |

---

### 问题2

在开发过程中，最常用的组件是我们的基本UI组件，如`<number-input>`、`<select-menu>`等。有时候忘记怎么配置这些组件的属性，需要查阅文档。

### 解决方案

* 添加了常用基本组件代码补全，比如输入 `<select-menu`时，会自动补全组件的属性和示例值
* 添加了组件文件跳转，比如光标在`<select-menu>`上时，可以按`F12`快速跳转到`select-menu.html`文件

---

### 问题3

在引用Aurelia组件时，不确定组件的名称和位置。

```html
<require from="./components/my-component/my-component"></require>
```

### 解决方案

* 添加了文件路径建议列表，比如，在输入`<require from="./`时，会自动根据当前文件结构，给出对应的文件夹和文件建议列表

---

### 问题4

在添加i18n支持时，需要手动去找到对应的i18n key，然后添加到html文件中。

### 解决方案

* 添加了i18n key建议列表，在输入`t="`时，可以直接输入想要的`text`值, 会根据输入的内容和我们的resource json文件，自动给出建议的i18n key列表