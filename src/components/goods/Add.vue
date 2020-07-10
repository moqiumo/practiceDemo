<template>
  <div>
     <!-- 导航栏区域 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-Card>
      <!-- 提示区域 -->
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏区域 -->
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave"
        @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
             <el-cascader
              :options="cateList"
              expand-trigger="hover"
              :props="cateProps"
              v-model="addForm.goods_cat"
              @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData"
            :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals"
                :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
            :key="item.attr_id" border>
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="hangdleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce">111</quill-editor>
            <el-button type="primary" class="butAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-Card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      // 添加商品的表单对象
      addForm: {
        goods_name: '',
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        // 商品所属的分类数组
        goods_cat: [],
        pics: [],
        // 商品的详情介绍
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', tigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', tigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', tigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', tigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      cateList: [],
      cateProps: {
        // 看到的
        label: 'cat_name',
        // 选中的
        value: 'cat_id',
        // 父子节点的嵌套
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      // 上传图片URL
      uploadUrl: 'http://localhost:8888/api/private/v1/upload',
      // 图片上传对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    // 级联选择器，选中项变化，会触发这个函数
    handleChange() {
      // console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        // this.activeIndex = '0'
        // this.activeIndex = '4'
        return this.$message.error('请先选择商品分类！')
      }
      return this.$message.success('111')
    },
    async tabClicked() {
      switch (this.activeIndex) {
        case '1':
          this.clickTab()
          break
        case '2': {
          const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'only'
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('获取静态属性失败!')
          }
          // console.log(res.data)
          // res.data.forEach(item => {
          //   item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          // })
          this.onlyTableData = res.data
          break
        }
      }
    },
    async clickTab() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: 'many'
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取动态参数失败!')
      }
      // console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
      })
      this.manyTableData = res.data
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
      console.log(file)
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 获取将要删除的图片路径
      // 从pics数组中找到这个图片的索引
      // 调用splice方法，把图片对象从ppics数组中删除
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      // console.log(this.addForm.pics)
    },
    hangdleSuccess(response) {
      // 拼接得到一个图片信息对象
      // 插入到数组
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数、静态属性
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
        console.log(form)
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style less="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0;
}
.previewImg {
  width: 100%;
  height: 100%;
}
.butAdd {
  margin-top  : 15px;
}
</style>
