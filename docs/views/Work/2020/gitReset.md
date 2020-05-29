---
title: Git Pull强制覆盖本地文件
date: 2019-10-15
tags:
 - Work
categories:
 -  Work
---

删除本地文件后，想从远程仓库中从新Pull最新版文件。

Git提示：up-to-date，但未得到删除的文件

原因：当前本地库处于另一个分支中，需将本分支发Head重置至master.

```
git checkout master 
git reset --hard
```

git在切代码分支时经常碰到这样的问题：error: Your local changes to the following files would be overwritten by merge
有时本地并没有需要保存的修改，所以可以通过以下方式把本地文件强制覆盖掉。

```
git fetch --all
git reset --hard origin/master
git pull
```

1、git fetch 相当于是从远程获取最新到本地，不会自动merge，如下指令：

```
git fetch orgin master //将远程仓库的master分支下载到本地当前branch中
git log -p master  ..origin/master //比较本地的master分支和origin/master分支的差别
git merge origin/master //进行合并
```

也可以用以下指令：

```
git fetch origin master:tmp //从远程仓库master分支获取最新，在本地建立tmp分支
git diff tmp //將當前分支和tmp進行對比
git merge tmp //合并tmp分支到当前分支
```

2、git pull：相当于是从远程获取最新版本并merge到本地

```
git pull origin master
```

git pull 相当于从远程获取最新版本并merge到本地

在实际使用中，git fetch更安全一些

```
git reset--hard origin/master
```

git reset (–mixed) HEAD~1
回退一个版本,且会将暂存区的内容和本地已提交的内容全部恢复到未暂存的状态,不影响原来本地文件(未提交的也
不受影响)
git reset –soft HEAD~1
回退一个版本,不清空暂存区,将已提交的内容恢复到暂存区,不影响原来本地的文件(未提交的也不受影响)
git reset –hard HEAD~1
回退一个版本,清空暂存区,将已提交的内容的版本恢复到本地,本地的文件也将被恢复的版本替换