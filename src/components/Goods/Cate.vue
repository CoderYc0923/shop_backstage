<template>
  <div id="cate">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=" "
        border
        :show-row-hover="false"
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <!-- 文字提示 -->
          <el-tooltip
            effect="dark"
            content="编辑"
            placement="top"
            :enterable="false"
          >
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            ></el-tooltip
          >
          <!-- 文字提示 -->
          <el-tooltip
            effect="dark"
            content="删除"
            placement="top"
            :enterable="false"
          >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            ></el-tooltip
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 表单区 -->
      <el-form
        :model="addCateForm"
        :rules="aaddCateFormRules"
        ref="aaddCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="parentCateChange"
            clearable
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据
      cateList: [],
      //总数据条数
      total: 0,
      //为tree-table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      //控制显示添加分类的对话框
      addCateDialogVisible: false,
      //添加分类的表单数据
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      //添加分类表单的校验规则
      aaddCateFormRules: {
        cat_name: [
          { required: true, message: "请输入商品类名", trigger: "blur" },
        ],
      },
      //父级分类的列表数据
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {},
      //选定的父级分类的ID数组
      selectKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200)
        return this.$message.error("获取商品分类失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击显示添加新商品分类对话框
    showAddCate() {
      this.getParentCateDialog();
      this.addCateDialogVisible = true;
    },
    //获取父级分类的数据列表
    async getParentCateDialog() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status != 200)
        return this.$message.error("获取父级分类数据失败");
      this.parentCateList = res.data;
    },
    //关闭对话框清空表单
    addCateDialogClosed() {
      this.$refs.aaddCateFormRef.resetFields();
      (this.selectKeys = []),
        (this.addCateForm.cat_level = 0),
        (this.addCateForm.cat_pid = 0);
    },
    //选择项发生变化时触发
    parentCateChange() {
      //如果selectKeys数组中的长度大于0，证明选中的父级分类
      if (this.selectKeys.length > 0) {
        //为当前新建分类的父级分类ID赋值
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        //为当前新建分类等级赋值
        this.addCateForm.cat_level = this.selectKeys.length;
        return;
      } else {
        //为当前新建分类的父级分类ID赋值
        this.addCateForm.cat_pid = 0;
        //为当前新建分类等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮，添加新商品分类
    addCate() {
      this.$refs.aaddCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status != 201)
          return this.$message.error("添加商品分类失败");
        this.$message.success("添加商品分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>