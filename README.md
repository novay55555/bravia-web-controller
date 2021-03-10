# Bravia Web Controller

索尼电视(Bravia TV)的网页控制器, 通过访问网页, 可以对索尼电视进行一些快捷的操作, 从而减少对遥控器的依赖.

## 准备工作

在使用网页控制器前, 你需要准备以下事项:

- 索尼电视和你打开网页的设备连接`wifi`
- 在`设置 -> 网络 -> 高级设置 -> 网络状态 -> IP地址`, 找到并记住索尼电视的ip地址.
- 在`设置 -> 网络 -> 家庭网络设置 -> IP控制`, 选择`预共享密钥`或`预共享密钥`, 然后输入你的`预共享密钥`. **请务必记住你设置的密钥, 在网页中需要填写**
- 在`设置 -> 网络 -> 家庭网络设置 -> Renderer`, 开启`Renderer功能`

## 如何使用

准备工作完成后, 你可以使用浏览器直接访问[链接](http://bravia.bing89.com/), 或者启动一个服务器运行本项目的`生产代码`. 首次访问会提示你输入`ip`和`psk`, `ip`即为上述的索尼电视ip地址, `psk`则是上述你输入的`预共享密钥`. **正确输入**完成后就可以开始控制你的索尼电视了!

## 命令模式

你可以通过链接上特定的参数组合, 开达到一键控制索尼电视的目的, 如:

> http://bravia.bing89.com/?command=open_app&app_name=Firefox

`command`即为命令, 如上面表示为打开app. `app_name`是打开app命令的参数, 如上面表示为火狐App的名称. 因此当你访问上面的链接, 其实就是通知索尼电视打开火狐App

### 目前支持的命令

|命令|对应参数|说明|
|:-|:-|:-|
|power_tv|status|`0`为关闭电视, `1`为打开电视|
|open_app|app_name|app_name对应索尼TV显示的应用名称|
|set_audio|volume, target|`volume`对应音量的数值, `target`可选值为扬声器(`speaker`), 耳机(`headphone`)|

## 开发文档

> https://pro-bravia.sony.net/zhs/develop/index.html
