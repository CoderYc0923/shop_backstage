<template>
  <div id="users">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <template #append>
              <el-button
                icon="el-icon-search"
                @click="getUsersList"
              ></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="usersList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- scope当前作用域插槽 -->
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 文字提示 -->
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <!-- 修改按钮 -->
              <!-- scope.row.id将当前列的id传入修改用户信息对话框 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 分配角色按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 表单区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="addForm.checkPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 表单区 -->
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="RightsDialogVisible"
      width="50%"
      @close="RightsDialogClosed"
      class="select"
    >
      <div>
        <p>当前用户: {{ userInfo.username }}</p>
        <p>当前角色: {{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部区 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="RightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //邮箱验证规则
    var checkEmail = (rule, value, cb) => {
      //邮箱正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        //合法邮箱
        return cb();
      }
      cb(new Error("请输入正确的邮箱地址"));
    };
    //手机号验证规则
    var checkMobile = (rule, value, cb) => {
      //手机号正则
      const regMobile = /^1[3456789]\d{9}$/;
      if (regMobile.test(value)) {
        //合法手机号
        return cb();
      }
      cb(new Error("请输入正确的手机号"));
    };
    //再次输入密码验证
    var checkPass = (rule, value, cb) => {
      if (value !== this.addForm.password) {
        cb(new Error("两次输入密码不一致!"));
      }
      cb();
    };
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        //当前所在的页数
        pagenum: 1,
        //当前每页显示多少条
        pagesize: 2,
      },
      usersList: [],
      //总页数
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        //密码再验证
        checkPass: "",
        mobile: "",
        email: "",
      },
      //添加用户表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入你的用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入你的密码", trigger: "blur" },
          {
            min: 6,
            message: "密码的长度不少于6位",
            trigger: "blur",
          },
        ],
        checkPass: [
          { required: true, message: "请再次输入你的密码", trigger: "blur" },
          { validator: checkPass, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入你的手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入你的邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      //查询到的修改用户的表单数据
      editFrom: {},
      //修改用户表单的验证规则
      editFromRules: {
        mobile: [
          { required: true, message: "请输入你的手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入你的邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      //控制分配权限对话框的显示与隐藏
      RightsDialogVisible: false,
      //需要被分配权限的用户信息
      userInfo: {},
      //所有角色的数据列表
      rolesList: [],
      //已选中的角色ID值
      selectRoleId: '',
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    //获取用户列表的数据
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.usersList = res.data.users;
      this.total = res.data.total;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      //将改变的pagesize赋值给queryInfo，并且重新发起axios请求用户列表数据
      this.queryInfo.pagesize = newSize;
      this.getUsersList();
      // console.log(newSize);
    },
    //监听页码改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUsersList();
      // console.log(newPage);
    },
    //监听开关状态的改变
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status != 200) {
        //更新用户状态失败需让页面上的状态保持原样
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      //重置表单内容，让下次打开时表单是全新的
      this.$refs.addFormRef.resetFields();
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      //重置表单内容，让下次打开时表单是全新的
      this.$refs.editFormRef.resetFields();
    },
    //点击按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", {
          username: this.addForm.username,
          password: this.addForm.password,
          email: this.addForm.email,
          mobile: this.addForm.mobile,
        });
        if (res.meta.status != 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        //隐藏添加用户对话框
        this.addDialogVisible = false;
        //添加成功后刷新用户列表
        this.getUsersList();
      });
    },
    //展示用户编辑的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status != 200)
        return this.$message.error("修改用户信息失败");
      this.editFrom = res.data;
      this.editDialogVisible = true;
    },
    //点击按钮修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editFrom.id,
          {
            email: this.editFrom.email,
            mobile: this.editFrom.mobile,
          }
        );
        if (res.meta.status != 200)
          return this.$message.error("修改用户信息失败");
        this.$message.success("修改用户信息成功");
        //隐藏修改用户信息对话框
        this.editDialogVisible = false;
        //添加成功后刷新用户列表
        this.getUsersList();
      });
    },
    //点击按钮删除用户信息
    async removeUserById(id) {
      //弹框提示用户是否删除数据
      const confirmRes = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      //确认删除confirmRes返回confirm,取消删除返回cancel
      if (confirmRes != "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.delete("users/" + id);

      if (res.meta.status != 200) return this.$message.error("删除用户失败");

      this.$message.success("删除用户成功");
      //添加成功后刷新用户列表s
      this.getUsersList();
    },
    //展示角色分配对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      //展示对话框之前获取角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      this.RightsDialogVisible = true;
    },
    //点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) return this.$message.error('请选择要分配的角色')
      const { data:res } = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId})
      if (res.meta.status != 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.getUsersList()
      this.RightsDialogVisible = false
    },
    //监听分配角色对话框的关闭事件
    RightsDialogClosed() {
      //重置下拉框内容，让下次打开时下拉框默认显示请选择
     this.selectRoleId = '',
     this.userInfo = []
    },
  },
};
</script>
<style lang="less" scoped>
 .select {
  text-align: left;
 }
</style>