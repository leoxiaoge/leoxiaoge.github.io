---
title: element的el-table表格自定义表头，slot="header"内，数据不更新的问题
date: 2021-03-11
tags:
 - Vue
categories:
 -  Vue
---

element 官网上el-table上使用插槽 slot=“header”来实现自定义表头，在表头中使用el-select组件选择不同的状态，无法展示选择后的状态，将slot=“header” 改成#header

```
<template>
    <div class="absolute-container">
        <page-header>
            <template #title>
                <span>设备管理</span>
                <el-tooltip class="tooltip-item" effect="dark" content="菜单模式" placement="top">
                    <svg-icon name="show-menu" @click="showTap()" />
                </el-tooltip>
            </template>
        </page-header>
        <page-main class="page-container">
            <PageUpdate ref="PageUpdate" />
            <search-bar>
                <div class="batch-operate-container">
                    <div v-for="element in ManagerGroups" :key="element.ID">
                        <el-dropdown style="margin: 0 10px;">
                            <el-button type="primary">
                                <img style="width: 20px; vertical-align: middle; margin-right: 6px;" :src="`http://ctrl.js.xebill.cn/${element.GroupIcon}`">
                                {{ element.GroupName }}
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in element.functions" :key="item.ID" @click.native.prevent="handleOptionchange(item)">
                                    <img style="width: 20px; vertical-align: middle; margin-right: 6px;" :src="`http://ctrl.js.xebill.cn/${item.FunctionIcon}`">
                                    <span>{{ item.FunctionTitle }}</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <el-dropdown>
                        <el-button type="primary">
                            设备启用/停用
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in global.EnabledStatus" :key="item.value" @click.native.prevent="DeviceEnabledSet(item.value)">{{ item.label }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </search-bar>
            <el-checkbox v-model="checkAll" class="batch-operate-checkbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange">名称</el-checkbox>
            <el-table
                ref="table"
                :data="Groups"
                :span-method="arraySpanMethod"
                row-key="ID"
                stripe
                border
                default-expand-all
                highlight-current-row
                :tree-props="{children: 'Devices'}"
            >
                <el-table-column prop="title" width="180" show-overflow-tooltip>
                    <template #header>
                        <el-checkbox v-model="checkAll" class="batch-operate-checkbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange">名称</el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox v-if="scope.row.groupID" v-model="scope.row.check" class="batch-operate-checkbox" @change="handleCheckChange" />
                        <span>{{ scope.row.title }}</span>
                        <span v-if="scope.row.AllDevices">（{{ scope.row.OnlineDevices }}/{{ scope.row.AllDevices }}）</span>
                    </template>
                </el-table-column>
                <el-table-column prop="deviceStatus" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                        <div v-for="(item, index) in global.OnlineStatus" :key="item.value">
                            <div v-if="scope.row.deviceStatus === item.value">
                                <el-tag v-if="index === 1" type="success">{{ item.label }}</el-tag>
                                <el-tag v-else-if="index === 0" type="danger">{{ item.label }}</el-tag>
                                <el-tag v-else>{{ item.label }}</el-tag>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="IsEnabled" label="是否启用" align="center" width="80">
                    <template slot-scope="scope">
                        <div v-for="(item, index) in global.Enabled" :key="item.value">
                            <div v-if="scope.row.IsEnabled === item.value">
                                <el-tag v-if="index === 0" type="success">{{ item.label }}</el-tag>
                                <el-tag v-else-if="index === 1" type="danger">{{ item.label }}</el-tag>
                                <el-tag v-else>{{ item.label }}</el-tag>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="AccessibliltyIsEnabled" label="无障碍" align="center" width="80">
                    <template slot-scope="scope">
                        <div v-for="(item, index) in global.Enabled" :key="item.value">
                            <div v-if="scope.row.AccessibliltyIsEnabled === item.value">
                                <el-tag v-if="index === 0" type="success">{{ item.label }}</el-tag>
                                <el-tag v-else-if="index === 1" type="danger">{{ item.label }}</el-tag>
                                <el-tag v-else>{{ item.label }}</el-tag>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="deviceAliasName" label="别名" show-overflow-tooltip />
                <el-table-column prop="devicePosiCode" label="机位号" show-overflow-tooltip />
                <el-table-column prop="phoneNumber" label="手机号" show-overflow-tooltip />
                <el-table-column prop="deviceBrand" label="品牌" show-overflow-tooltip />
                <el-table-column prop="deviceModel" label="型号" show-overflow-tooltip />
                <el-table-column prop="androidOsVersion" label="系统版本" show-overflow-tooltip />
                <el-table-column prop="clientFrameworkVer" label="内部版本号" show-overflow-tooltip />
                <el-table-column prop="wifiName" label="WIFI信号" show-overflow-tooltip />
                <el-table-column prop="AddTime" label="添加时间" show-overflow-tooltip align="center" width="160" />
                <el-table-column prop="lastOnlineTime" label="最近在线时间" show-overflow-tooltip align="center" width="160" />
            </el-table>
        </page-main>
        <el-dialog v-dialogDrag :title="dialogTitle" :visible.sync="dialogVisible" :width="device==='mobile'?'100%':'40%'">
            <el-form ref="form" :model="form" :rules="rules" :label-width="device==='mobile'?'30%':'20%'">
                <div v-for="item in form.inputs" :key="item.ID">
                    <el-form-item :label="item.paramentTitle">
                        <el-input v-if="item.paramentType === 0" v-model="item.paramentDefaultValue" clearable />
                        <el-input-number v-else-if="item.paramentType === 1" v-model="item.paramentDefaultValue" controls-position="right" />
                        <el-input v-else v-model="item.paramentDefaultValue" clearable />
                        <p>{{ item.paramentDesc }}</p>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog">取 消</el-button>
                <el-button type="primary" @click="confirmDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import PageUpdate from '@/views/device_managers/components/page_update'

export default {
    name: 'DeviceManagersPageList',
    components: {
        PageUpdate
    },
    data() {
        return {
            // Dialog 对话框
            dialogVisible: false,
            // Dialog 对话框标题
            dialogTitle: '',
            // 表单
            form: {},
            // 规则
            rules: {

            },
            // 全选
            checkAll: false,
            // 设置 indeterminate 状态，只负责样式控制
            isIndeterminate: false,
            // 设备列表
            Groups: [],
            // 批量操作
            ManagerGroups: [],
            // 选中的列表
            DeviceIds: [],
            // 操作类型
            FunctionId: undefined
        }
    },
    computed: {
        ...mapState({
            device: state => state.app.device,
            global: state => state.global
        })
    },
    created() {
        this.init()
    },
    mounted() {
        this.$nextTick(() => {
            // 获取表头高度，然后设置 .el-table__body-wrapper 的 height
            let height = document.getElementsByClassName('el-table__header-wrapper')[0].offsetHeight
            document.getElementsByClassName('el-table__body-wrapper')[0].style.height = `calc(100% - ${height}px)`
        })
    },
    methods: {
        // 初始化
        init() {
            this.DeviceManagerFunctionsListGet()
            this.DevicesByGroupsListGet()
        },
        // 合并行或列
        arraySpanMethod({ row, columnIndex }) {
            const columns = this.$refs['table'].columns
            if (!row.groupID) {
                if (columnIndex === 0) {
                    return [1, columns.length]
                } else if (columnIndex === 1) {
                    return [0, 0]
                }
            }
        },
        // 选择
        handleCheckChange() {
            this.DeviceIds = []
            let list = []
            this.Groups.forEach(item => {
                item['Devices'].forEach(element => {
                    if (element.check) {
                        this.DeviceIds.push(element)
                    }
                    list.push(element)
                })
            })
            let checkedCount = this.DeviceIds.length
            this.checkAll = checkedCount === list.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < list.length
        },
        // 全选
        handleCheckAllChange(val) {
            // 控制选择框
            this.Groups.forEach(item => {
                item['Devices'].forEach(element => {
                    element['check'] = val
                })
            })
            this.isIndeterminate = false
        },
        // 获取设备管理功能分组和列表
        DeviceManagerFunctionsListGet() {
            const data = {}
            this.$store.dispatch('DeviceManagers/DeviceManagerFunctionsListGet', data).then(response => {
                this.ManagerGroups = response.ManagerGroups
            })
        },
        // 按分组获取设备列表
        DevicesByGroupsListGet() {
            const data = {}
            this.$store.dispatch('DeviceManagers/DevicesByGroupsListGet', data).then(response => {
                response.Groups.forEach(item => {
                    item['title'] = item.groupTitle
                    item['Devices'].forEach(element => {
                        element['title'] = element.deviceModel
                        element['check'] = false
                    })
                })
                this.Groups = response.Groups
            })
        },
        // 批量操作选择
        handleOptionchange(row) {
            if (row.inputs.length > 0) {
                this.dialogVisible = true
                this.dialogTitle = row.FunctionTitle
                this.form = JSON.parse(JSON.stringify(row))
            }
        },
        // 设备启停用
        DeviceEnabledSet(value) {
            let DeviceIds = []
            this.Groups.forEach(item => {
                item['Devices'].forEach(element => {
                    if (element.check) {
                        this.DeviceIds.push(element)
                        DeviceIds.push(element.ID)
                    }
                })
            })
            if (DeviceIds.length <= 0) {
                this.$message({
                    message: '请选择要操作的条目！',
                    type: 'warning'
                })
                return
            }
            DeviceIds = `${DeviceIds.join('/')}`
            const data = {
                DeviceIds: DeviceIds,
                IsEnabled: value
            }
            this.$store.dispatch('DeviceManagers/DeviceEnabledSet', data).then(() => {
                this.init()
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                })
                this.checkAll = false
                this.isIndeterminate = false
            })
        },
        // 批量操作确定
        handleBatchOperate() {
            this.DeviceIds = []
            let DeviceIds = []
            this.Groups.forEach(item => {
                item['Devices'].forEach(element => {
                    if (element.check) {
                        this.DeviceIds.push(element)
                        DeviceIds.push(element.ID)
                    }
                })
            })
            if (DeviceIds.length <= 0) {
                this.$message({
                    message: '请选择要操作的条目！',
                    type: 'warning'
                })
                return
            }
            if (!this.FunctionId) {
                this.$message({
                    message: '请选择操作项！',
                    type: 'warning'
                })
                return
            }
            DeviceIds = `${DeviceIds.join('/')}`
            let Inputs = []
            this.form.inputs.forEach(item => {
                let obj = {}
                obj['ID'] = item['ID']
                obj['Name'] = item['paramentName']
                obj['Value'] = item['paramentDefaultValue']
                Inputs.push(obj)
            })
            this.DeviceBatchAction(DeviceIds, Inputs)
        },
        // 设备管理批量操作
        DeviceBatchAction(DeviceIds, Inputs) {
            Inputs = JSON.stringify(Inputs)
            const data = {
                FunctionId: this.FunctionId,
                DeviceIds: DeviceIds,
                Inputs: Inputs
            }
            this.$store.dispatch('DeviceManagers/DeviceBatchAction', data).then(() => {
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                })
            })
        },
        // 取消
        cancelDialog() {
            this.dialogVisible = false
            this.$refs['form'].resetFields()
        },
        // 确定
        confirmDialog() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.inputs.length > 0) {
                        this.handleBatchOperate()
                    }
                } else {
                    return false
                }
            })
        },
        // 模式切换
        showTap() {
            this.$nextTick(() => {
                // 获取表头高度，然后设置 .el-table__body-wrapper 的 height
                let height = document.getElementsByClassName('el-table__header-wrapper')[0].offsetHeight
                document.getElementsByClassName('el-table__body-wrapper')[0].style.height = `calc(100% - ${height}px)`
            })
            this.$emit('showTap')
        }
    }
}
</script>

<style lang="scss" scoped>
.page-main {
    display: flex;
    flex-direction: column;
    // 减去的 40px 为 page-main 的上下 margin
    // 减去的 130px 为 page-header 的高度，如果没有设置，可以去掉
    height: calc(100% - 100px);
    ::v-deep .el-table {
        height: 100%;
        .el-table__body-wrapper {
            overflow-y: auto;
        }
    }
}
.tooltip-item {
    cursor: pointer;
}
.batch-operate-container {
    display: flex;
    justify-content: flex-start;
}
.batch-operate-checkbox {
    margin-right: 10px;
    vertical-align: middle;
}
</style>
```

