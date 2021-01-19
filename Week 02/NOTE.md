学习笔记

## 地图编辑器

搜索是通用性特别好的一类算法，寻路有UI的部分，有js特有的和语言结合的部分。

100x100地图进行算法，左键描点，右键扣点

思路：
1. 初始化一个长度10000的一维数组，进行fill
2. 行列两层for循环，将cell填进去，判断值决定是否进行填色（这儿我直接一维for）
3. cell的事件监听， cell有mousemove时，在document有左键按下的事件的时候，对该cell进行上色，右键（e.which===3）则是清除
4. document的contextmenu事件要禁止(e.preventDefault)
5. 保存按钮——把这个数组存到localStorage里，每次读取页面都会优先使用localStorage里的数组

## 寻路问题

从起点到终点，找出一条路径

广度优先搜索，某一点周围的点

```
function path(map, start, end) {
	var queue = [start]

	function insert(x, y) {
		if (触到边界 || 点已经走过 || 点的值不为空) {
			return;
		}
		
		map[y*100+x] = 2
		queue.push([x,y])
	}

	while (queue还有点) {
		取出第一个点
		if (第一个点是终点) {
			return true
		}
		insert(左)
		insert(下)
		insert(右)
		insert(上)
	}

	return false
}
```

shift unshift 数组首取出和加入
push pop 数组尾加入和取出

队列
1. push shift
2. pop unshift

栈 push pop (shift unshift可能会有性能问题，一般不这样用)

广度优先搜索是队列
深度优先搜索是栈

## 异步编程可视化寻路算法

目前寻路存在问题：
正确性不好保证
找到一条路径，不只是能不能走过去

用到上节课的sleep函数：

```
function sleep(t) {
	return new Promise(function(resolve) {
		setTimeout(resolve, t)
	})
}
```

将来课程也会用到

上节课的函数通过async await进行异步化处理

```
async function path(map, start, end) {
	var queue = [start]

	async function insert(x, y) {
		if (触到边界 || 点已经走过 || 点的值不为空) {
			return;
		}
		
		// 稍微等一下，这样能看出每次insert的变化
		await sleep(30)
		// 把对应的格子标浅绿色，可以在地图上直观看到结果
		container.children[y*100+x].style.backgroundColor = 'lightgreen'
		map[y*100+x] = 2
		queue.push([x,y])
	}

	while (queue还有点) {
		取出第一个点
		if (第一个点是终点) {
			return true
		}
		await insert(左)
		await insert(下)
		await insert(右)
		await insert(上)
	}

	return false
}
```
