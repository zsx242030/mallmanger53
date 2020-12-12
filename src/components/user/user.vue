<template>
  <div class="login-wrap">
    <el-card class="box-card">
    <!--1.面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item >首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--搜索框-->
      <el-row class="searchRow">
        <el-col>
          <el-input @clear="loadUserList()" placeholder="请输入内容" clearable v-model="query" class="inputSearch">
            <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
        </el-col>
      </el-row>
      <!--3.表格-->
      <el-table
        :data="userlist"
        style="width: 100%">

        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>

        <el-table-column
          prop="username"
          label="姓名"
          width="80">
        </el-table-column>

        <el-table-column
          prop="email"
          label="邮箱"
          width="220">
        </el-table-column>

        <el-table-column
          prop="mobile"
          label="电话"
          width="200">
        </el-table-column>

        <el-table-column
          prop="create_time"
          label="创建时间"
          width="200">
          <template slot-scope="scope">
            {{scope.row.create_time|fmtdate}}
          </template>
        </el-table-column>

        <el-table-column
          prop="mg_state"
          label="用户状态"
          width="200">
          <template slot-scope="scope">
            <el-switch
              @change="changeMgState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>

          </template>
        </el-table-column>

        <el-table-column
          prop="address"
          label="操作"
          width="200">
          <template slot-scope="scope">
              <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditUserDia(scope.row)"></el-button>
              <el-button size="mini" plaintype="success" icon="el-icon-check" circle @click="showSetUserRoleDia(scope.row)"></el-button>
              <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDeleUserMsgBox(scope.row.id)"></el-button>
          </template>
        </el-table-column>

      </el-table>

      <!--4.分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--添加用户的对话框-->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
          <el-form-item label="用户名" label-width="100px">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="密 码" label-width="100px">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮 箱" label-width="100px">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="电 话" label-width="100px">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
      </el-dialog>


      <!--显示用户/编辑的对话框-->
      <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
          <el-form-item label="用户名" label-width="100px">
            <el-input disabled v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮 箱" label-width="100px">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="电 话" label-width="100px">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
      </el-dialog>

      <!--显示角色的对话框-->
      <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
        <el-form :model="form">
          <el-form-item label="用户名：" label-width="100px">
            {{currUsername}}
          </el-form-item>
          <el-form-item label="角 色：" label-width="100px">
            <el-select v-model="currRoleId">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
          <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        query:'',
        pagesize:2,
        pagenum:2,
        userlist: [],
        //分页相关的数据
        total:-1,
        pagenum:1,
        pagesize:4,
        dialogFormVisibleAdd:false,
        dialogFormVisibleEdit:false,
        dialogFormVisibleRol:false,
        form:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        currRoleId:-1,
        currUserId:-1,
        currUsername:'',
        roles:[]
      }
    },
    created(){
      this.getUserList()
    },
    methods:{
      async setRole(){
        const res = await  this.$http.put(`users/${this.currUserId}/role`,{rid:this.currRoleId})
        console.log(res)
        this.dialogFormVisibleRol = false
      },
      async showSetUserRoleDia(user){
        this.currUsername = user.username
        this.currUserId = user.id
        const res = await this.$http.get(`users/${user.id}`)
        const res1 = await this.$http.get(`roles`)
        this.roles = res1.data.data
        this.currRoleId = res.data.data.rid
        this.dialogFormVisibleRol = true
      },
      async changeMgState(user){
        const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        console.log(res)
      },
      async editUser(){
        const res= await this.$http.put(`users/${this.form.id}`,this.form)
        if(res.data.meta.status===200){
          this.dialogFormVisibleEdit = false
          this.getUserList()
          this.$message.success("更新成功")
        }
        else{
          this.dialogFormVisibleEdit = false
          this.getUserList()
          this.$message.warning("更新失败")
        }
      },
      showEditUserDia(user){
        this.form = user
        this.dialogFormVisibleEdit = true
      },
      showDeleUserMsgBox(userId){
        console.log(userId)
        this.$confirm('删除用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`users/${userId}`)
          console.log(res)
          if(res.data.meta.status===200){
            this.pagenum = 1
            this.getUserList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      async addUser(){
        this.dialogFormVisibleAdd = false
        const res = await this.$http.post('users',this.form)
        console.log(res)
        const {meta:{status,msg},data} = res.data
        if(status===201){
          this.$message.success(msg)
          this.getUserList()
          this.form={}
        }
        else{
          this.$message.warning(msg)
          this.getUserList()
          this.form={}
          // for(const key in this.form){
          //   if(this.form.hasOwnProperty(key)){
          //     this.form[key]=""
          //   }
          // }
        }
      },
      showAddUserDia(){
        this.form ={}
        this.dialogFormVisibleAdd=true
      },
      loadUserList(){
        this.getUserList()
      },
      searchUser(){
        this.getUserList()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pagesize = val
        this.getUserList()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pagenum =val
        this.getUserList()
      },
      async getUserList(){
        const AUTH_TOKEN = localStorage.getItem("token")
        this.$http.defaults.headers.common['Authorization']=AUTH_TOKEN
        const res = await this.$http.get(`users?query=${this.query}&pagesize=${this.pagesize}&pagenum=${this.pagenum}`)
        console.log(res)
        const {meta:{status,msg},data:{users,total}} = res.data
        if(status===200)
        {
          //1.给表格数据f赋值
          this.userlist=users
          this.total=total
          this.$message.success(msg)
        }
        else{
          this.$message.waring(msg)
        }
      }
    }
  }

</script>

<style>
  .box-card{
    height:100%;
  }
  .inputSearch{
    width:700px;
  }

  .searchRow{
    margin-top: 20px;

  }
</style>
