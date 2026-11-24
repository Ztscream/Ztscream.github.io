---
title: "深入浅出PyTorch：模型评估指标"
date: 2026-11-24
topic: "深入浅出PyTorch"
description: "从混淆矩阵出发，整理 OA、AA、Kappa、Precision、Recall、F1、PR 曲线、IoU、AP 与 mAP 的定义、公式和代码。"
tags: [PyTorch, 深度学习, 评估指标]
category: notes
share: true
---

## 混淆矩阵

几乎所有分类指标都从混淆矩阵算出来。以二分类为例：

|              | 预测为正 | 预测为负 |
| ------------ | -------- | -------- |
| **实际为正** | TP       | FN       |
| **实际为负** | FP       | TN       |

- **TP（True Positive）**：实际为正，预测也为正，预测对了。
- **FP（False Positive）**：实际为负，却预测为正，即误报。
- **FN（False Negative）**：实际为正，却预测为负，即漏报。
- **TN（True Negative）**：实际为负，预测也为负，预测对了。

> 记法：第二个字母（P/N）是**预测结果**，第一个字母（T/F）表示这个预测**对不对**。

多分类时，混淆矩阵是 $C \times C$ 的方阵。下文代码约定 `matrix[i][j]` 表示「真实类别为 $i$、预测类别为 $j$」的样本数：对角线是预测正确的数量，**行和**是各类真实样本数，**列和**是各类被预测出的数量。

```python
import numpy as np

def confusion_matrix(y_true, y_pred, num_classes):
    matrix = np.zeros((num_classes, num_classes), dtype=np.int64)
    for t, p in zip(y_true, y_pred):
        matrix[t, p] += 1
    return matrix
```

## 准确率

### OA（Overall Accuracy，总体准确率）

所有预测正确的样本占全部样本的比例：

$$
OA = \frac{TP + TN}{TP + TN + FP + FN}
$$

多分类时就是对角线之和除以总数：

```python
def compute_oa(matrix):
    """总体准确率：OA = (TP + TN) / (TP + TN + FP + FN)"""
    return np.trace(matrix) / np.sum(matrix)
```

### AA（Average Accuracy，平均准确率）

先算每一类的准确率（该类预测正确的样本数 ÷ 该类真实样本数），再对所有类取平均。二分类时：

$$
AA = \frac{1}{2}\left(\frac{TP}{TP + FN} + \frac{TN}{TN + FP}\right)
$$

AA 对每个类一视同仁。类别不均衡时，OA 会被大类主导，AA 更能反映小类的表现。

```python
def compute_aa(matrix):
    """平均准确率：每一类的准确率取平均"""
    return np.mean(np.diag(matrix) / np.sum(matrix, axis=1))
```

## Kappa 系数

Kappa 用于一致性检验，在分类问题里衡量「模型预测结果与真实标签的一致程度」，并扣除了随机猜测也能碰对的部分：

$$
\kappa = \frac{p_o - p_e}{1 - p_e}
$$

- $p_o$：观测一致率，也就是 OA。
- $p_e$：随机一致率。设共有 $N$ 个样本，第 $i$ 类的真实样本数为 $a_i$（行和），被预测为第 $i$ 类的数量为 $b_i$（列和），则

$$
p_e = \frac{\sum_{i} a_i \, b_i}{N^2}
$$

$\kappa$ 的取值范围为 $[-1, 1]$，越接近 1 一致性越好；等于 0 说明和随机猜测差不多。

```python
def compute_kappa(matrix):
    """Kappa 系数：(po - pe) / (1 - pe)"""
    po = compute_oa(matrix)
    total = np.sum(matrix)
    pe = np.sum(np.sum(matrix, axis=1) * np.sum(matrix, axis=0)) / total ** 2
    return (po - pe) / (1 - pe)
```

## 精准率、召回率与 F1

### Precision（精准率 / 查准率）

在所有**预测为正**的样本中，真正为正的比例，回答「报出来的有多少是对的」：

$$
Precision = \frac{TP}{TP + FP}
$$

### Recall（召回率 / 查全率）

在所有**实际为正**的样本中，被正确识别出来的比例，回答「该找的找到了多少」：

$$
Recall = \frac{TP}{TP + FN}
$$

两者通常此消彼长：阈值调高，Precision 上升、Recall 下降；阈值调低则反过来。

### F1 分数

F1 是 Precision 和 Recall 的**调和平均**，只有两者都高时 F1 才高：

$$
F1 = \frac{2 \cdot Precision \cdot Recall}{Precision + Recall} = \frac{2TP}{2TP + FP + FN}
$$

更一般的 $F_\beta$ 可以调节两者的权重，$\beta > 1$ 更看重 Recall，$\beta < 1$ 更看重 Precision：

$$
F_\beta = \frac{(1 + \beta^2) \cdot Precision \cdot Recall}{\beta^2 \cdot Precision + Recall}
$$

```python
def compute_prf(matrix, eps=1e-12):
    """逐类计算 Precision、Recall、F1，返回三个长度为 C 的数组"""
    tp = np.diag(matrix)
    precision = tp / (np.sum(matrix, axis=0) + eps)  # 列和：预测为该类的数量
    recall = tp / (np.sum(matrix, axis=1) + eps)     # 行和：该类的真实数量
    f1 = 2 * precision * recall / (precision + recall + eps)
    return precision, recall, f1
```

## PR 曲线

模型通常输出一个**置信度**（属于正类的概率）。设定一个阈值，置信度高于阈值的判为正，就能得到一组 (Recall, Precision)。把阈值从高到低扫一遍，就得到一条曲线：

- **横轴**：召回率 Recall
- **纵轴**：精准率 Precision

![PR 曲线示意：模型 A 的曲线完全包住模型 B，阴影为 A 的 AP](/uploads/pr-curve.svg)

怎么读这张图：

- **阈值很高时**（曲线左端）：只有把握极大的样本才判为正，报出来的几乎都对，Precision 接近 1，但漏掉很多，Recall 很低。
- **阈值逐渐降低**（沿曲线往右）：判为正的样本变多，Recall 上升，同时混进更多误报，Precision 下降。
- **阈值降到最低**（曲线右端）：所有样本都判为正，Recall = 1，Precision 跌到正样本在全体中的占比。

曲线越靠近右上角，模型越好。若一条曲线完全包住另一条（如图中 A 包住 B），前者在任何阈值下都不差于后者。两条曲线交叉时就不好直接比较，这时通常比较曲线下面积，也就是后文的 **AP**。

用 sklearn 可以直接画出真实的 PR 曲线：

```python
from sklearn.metrics import precision_recall_curve, average_precision_score
import matplotlib.pyplot as plt

# y_true: 0/1 真实标签；y_score: 模型输出的正类置信度
precision, recall, thresholds = precision_recall_curve(y_true, y_score)
ap = average_precision_score(y_true, y_score)

plt.plot(recall, precision, label=f"AP = {ap:.3f}")
plt.xlabel("Recall")
plt.ylabel("Precision")
plt.legend()
plt.show()
```

## 目标检测指标

### IoU（交并比）

IoU（Intersection over Union）又称雅卡尔指数（Jaccard Index），衡量预测框 $A$ 与真实框 $B$ 的重合程度：

$$
IoU = \frac{|A \cap B|}{|A \cup B|}
$$

IoU 在目标检测中有三个常见用途：

1. **判定预测是否正确**：IoU 超过阈值（如 0.5）的预测框才算 TP。
2. **后处理**：非极大值抑制（NMS）依据 IoU 去除重叠的冗余框。
3. **作为损失**：IoU Loss、GIoU Loss 等直接用它优化边框回归。

```python
def box_iou(box1, box2):
    """计算两个框的 IoU，框格式为 (x1, y1, x2, y2)"""
    ix1, iy1 = max(box1[0], box2[0]), max(box1[1], box2[1])
    ix2, iy2 = min(box1[2], box2[2]), min(box1[3], box2[3])
    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    return inter / (area1 + area2 - inter)
```

### AP（Average Precision）

AP 是 **PR 曲线下的面积**，把整条曲线压缩成一个数，综合反映不同阈值下的表现：

$$
AP = \int_0^1 P(R)\, dR
$$

实际计算时会先把 Precision 做单调化（每个召回率取其右侧的最大 Precision），再求面积。

### mAP（mean Average Precision）

对每个类别分别计算 AP，再取平均：

$$
mAP = \frac{1}{C} \sum_{i=1}^{C} AP_i
$$

常见写法 `mAP@0.5` 表示 IoU 阈值取 0.5；`mAP@0.5:0.95` 表示 IoU 阈值从 0.5 到 0.95、每隔 0.05 各算一次 mAP 再取平均（COCO 标准）。

## 小结

| 指标      | 公式                           | 关注点                         |
| --------- | ------------------------------ | ------------------------------ |
| OA        | $\frac{TP+TN}{N}$              | 整体预测对了多少               |
| AA        | 各类准确率的平均               | 类别不均衡时更公平             |
| Kappa     | $\frac{p_o-p_e}{1-p_e}$        | 扣除随机一致后的一致性         |
| Precision | $\frac{TP}{TP+FP}$             | 报出来的有多少是对的           |
| Recall    | $\frac{TP}{TP+FN}$             | 该找的找到了多少               |
| F1        | $\frac{2PR}{P+R}$              | 精准率与召回率的平衡           |
| IoU       | $\frac{\|A\cap B\|}{\|A\cup B\|}$ | 预测框与真实框的重合程度       |
| AP / mAP  | PR 曲线下面积 / 各类 AP 平均   | 检测模型的综合性能             |
