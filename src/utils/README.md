# 消息提示工具类使用文档

## MessageUtil

`MessageUtil` 是一个封装了Element Plus消息提示组件的工具类，旨在统一项目中的消息提示风格，减少重复代码。

### 安装

该工具类已内置在项目中，无需额外安装。

### 引入

在需要使用消息提示的组件中引入：

```javascript
import MessageUtil from '../utils/message.js'
```

### 方法列表

#### 1. 成功消息

```javascript
MessageUtil.success(message, options = {})
```

- `message`: 消息内容（字符串）
- `options`: 可选配置（对象），参考Element Plus的ElMessage配置

**示例：**
```javascript
MessageUtil.success('操作成功')
// 带配置的调用
MessageUtil.success('操作成功', { duration: 3000 })
```

#### 2. 警告消息

```javascript
MessageUtil.warning(message, options = {})
```

- `message`: 消息内容（字符串）
- `options`: 可选配置（对象）

**示例：**
```javascript
MessageUtil.warning('警告信息')
```

#### 3. 错误消息

```javascript
MessageUtil.error(message, options = {})
```

- `message`: 消息内容（字符串）
- `options`: 可选配置（对象）

**示例：**
```javascript
MessageUtil.error('操作失败')
```

#### 4. 信息消息

```javascript
MessageUtil.info(message, options = {})
```

- `message`: 消息内容（字符串）
- `options`: 可选配置（对象）

**示例：**
```javascript
MessageUtil.info('提示信息')
```

#### 5. 确认对话框

```javascript
MessageUtil.confirm(message, title = '确认', options = {})
```

- `message`: 消息内容（字符串）
- `title`: 对话框标题（字符串，默认：'确认'）
- `options`: 可选配置（对象），参考Element Plus的ElMessageBox配置

**示例：**
```javascript
try {
  await MessageUtil.confirm('确定要删除吗？', '删除确认')
  // 用户点击确认后的逻辑
} catch (error) {
  // 用户点击取消后的逻辑
}
```

#### 6. API错误处理

```javascript
MessageUtil.handleApiError(error, defaultMessage = '操作失败')
```

- `error`: 错误对象
- `defaultMessage`: 默认错误消息（字符串，默认：'操作失败'）

**示例：**
```javascript
try {
  // API调用
} catch (error) {
  MessageUtil.handleApiError(error, '获取数据失败')
}
```

#### 7. 操作结果处理

```javascript
MessageUtil.handleOperationResult(result, successMessage, errorMessage)
```

- `result`: 操作结果（可以是Promise）
- `successMessage`: 成功消息（字符串）
- `errorMessage`: 失败消息（字符串）

**示例：**
```javascript
// 处理Promise结果
await MessageUtil.handleOperationResult(
  apiCall(),
  '操作成功',
  '操作失败'
)

// 处理同步结果
MessageUtil.handleOperationResult(
  true,
  '操作成功',
  '操作失败'
)
```

### 替换旧代码示例

#### 替换ElMessage

**旧代码：**
```javascript
import { ElMessage } from 'element-plus'

ElMessage.success('操作成功')
ElMessage.error('操作失败')
```

**新代码：**
```javascript
import MessageUtil from '../utils/message.js'

MessageUtil.success('操作成功')
MessageUtil.error('操作失败')
```

#### 替换ElMessageBox.confirm

**旧代码：**
```javascript
import { ElMessageBox } from 'element-plus'

try {
  await ElMessageBox.confirm('确定要删除吗？', '确认删除')
  // 删除逻辑
} catch (error) {
  // 取消逻辑
}
```

**新代码：**
```javascript
import MessageUtil from '../utils/message.js'

try {
  await MessageUtil.confirm('确定要删除吗？', '确认删除')
  // 删除逻辑
} catch (error) {
  // 取消逻辑
}
```