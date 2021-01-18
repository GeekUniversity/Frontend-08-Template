学习笔记

## 地图编辑器

搜索是通用性特别好的一类算法，寻路有UI的部分，有js特有的和语言结合的部分。

100x100地图进行算法，左键描点，右键扣点

思路：
1. 初始化一个长度10000的一维数组，进行fill
2. 行列两层for循环，将cell填进去，判断值决定是否进行填色
3. cell的事件监听， cell有mousemove时，在document有左键按下的事件的时候，对该cell进行上色，右键（e.which===3）则是清除
4. document的contextmenu事件要禁止(e.preventDefault)
5. 保存按钮——把这个数组存到localStorage里，每次读取页面都会优先使用localStorage里的数组
