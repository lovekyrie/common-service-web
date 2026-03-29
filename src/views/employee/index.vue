<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createEmployee, getEmployee, updateEmployee } from '@/api/employee'

const route = useRoute()
const router = useRouter()

// 是否为编辑模式
const isEdit = ref(false)
const editingId = ref<number | null>(null)

// 分类导航
const categories = [
  { key: 'basic', label: '基础个人信息' },
  { key: 'job', label: '岗位与组织架构信息' },
  { key: 'payroll', label: '薪酬与银行卡信息' },
  { key: 'contract', label: '合同与履职信息' },
  { key: 'dynamic', label: '动态列表类信息' },
  { key: 'attachments', label: '入职附件与影像资料' },
  { key: 'custom', label: '自定义字段预留区' },
]

const activeCategory = ref('basic')

// 基础个人信息
const basicForm = reactive({
  name: '',
  gender: '',
  birthday: '',
  nation: '',
  idCard: '',
  maritalStatus: '',
  politicalStatus: '',
  birthPlace: '',
  household: '',
  bloodType: '',
  height: '',
  weight: '',
  healthStatus: '',
  phone: '',
  email: '',
  emergencyContact: '',
  emergencyPhone: '',
})

// 岗位与组织架构信息
const jobForm = reactive({
  employeeNo: '',
  department: '',
  position: '',
  jobLevel: '',
  employmentType: '',
  entryDate: '',
  workLocation: '',
  workProvince: '',
  workCity: '',
})

// 薪酬与银行卡信息
const payrollForm = reactive({
  salaryType: '',
  salaryCardBank: '',
  salaryCardNo: '',
  salaryCardName: '',
  socialSecurityNo: '',
  providentFundNo: '',
  taxType: '',
})

// 合同与履职信息
const contractForm = reactive({
  contractType: '',
  contractStart: '',
  contractEnd: '',
  contractPeriod: '',
  signingTimes: '',
  firstContractDate: '',
  probationPeriod: '',
  probationEndDate: '',
})

// 动态列表类信息 - 教育经历
const educationList = ref([
  { school: '', major: '', degree: '', startDate: '', endDate: '' },
])

function addEducation() {
  educationList.value.push({ school: '', major: '', degree: '', startDate: '', endDate: '' })
}

function removeEducation(index: number) {
  educationList.value.splice(index, 1)
}

// 动态列表类信息 - 工作经历
const workList = ref([
  { company: '', position: '', startDate: '', endDate: '', leavingReason: '' },
])

function addWork() {
  workList.value.push({ company: '', position: '', startDate: '', endDate: '', leavingReason: '' })
}

function removeWork(index: number) {
  workList.value.splice(index, 1)
}

// 动态列表类信息 - 家庭信息
const familyList = ref([
  { name: '', relation: '', phone: '', company: '' },
])

function addFamily() {
  familyList.value.push({ name: '', relation: '', phone: '', company: '' })
}

function removeFamily(index: number) {
  familyList.value.splice(index, 1)
}

// 入职附件与影像资料
const attachments = ref({
  idCardFront: '',
  idCardBack: '',
  degreeCert: '',
  graduationCert: '',
  healthCert: '',
  photos: [],
})

// 自定义字段预留区
const customFields = ref({
  customField1: '',
  customField2: '',
  customField3: '',
})

// 保存状态
const saving = ref(false)

// 提交数据
function submit() {
  saving.value = true
  // 构造提交数据
  const data = {
    basic: basicForm,
    job: jobForm,
    payroll: payrollForm,
    contract: contractForm,
    education: educationList.value,
    workExperience: workList.value,
    family: familyList.value,
    attachments: attachments.value,
    customFields: customFields.value,
  }

  const request = isEdit.value && editingId.value
    ? updateEmployee(editingId.value, data)
    : createEmployee(data)

  request
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success(isEdit.value ? '员工更新成功' : '员工创建成功')
        router.push({ name: 'employeeList' })
      }
      else {
        ElMessage.error(res.message || '操作失败')
      }
    })
    .catch((err) => {
      ElMessage.error(`操作失败: ${err.message}`)
    })
    .finally(() => {
      saving.value = false
    })
}

// 加载员工数据（编辑模式）
async function loadEmployeeData(id: number) {
  try {
    const res = await getEmployee(id)
    if (res.code === 200 && res.data) {
      const d = res.data
      // 回填表单数据
      Object.assign(basicForm, d.basic || {})
      Object.assign(jobForm, d.job || {})
      Object.assign(payrollForm, d.payroll || {})
      Object.assign(contractForm, d.contract || {})
      if (d.education?.length) {
        educationList.value = d.education
      }
      if (d.workExperience?.length) {
        workList.value = d.workExperience
      }
      if (d.family?.length) {
        familyList.value = d.family
      }
      Object.assign(attachments.value, d.attachments || {})
      Object.assign(customFields.value, d.customFields || {})
    }
  }
  catch (error) {
    console.error('获取员工数据失败', error)
    ElMessage.error('获取员工数据失败')
  }
}

// 初始化
onMounted(() => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    editingId.value = Number(id)
    loadEmployeeData(Number(id))
  }
})
</script>

<template>
  <div class="employee-roster">
    <!-- 左侧分类导航 -->
    <aside class="roster-nav">
      <div class="roster-nav__title">
        {{ isEdit ? '编辑员工' : '新增员工' }}
      </div>
      <ul class="roster-nav__list">
        <li
          v-for="cat in categories"
          :key="cat.key"
          class="roster-nav__item"
          :class="{ 'is-active': activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
        </li>
      </ul>
    </aside>

    <!-- 右侧表单内容 -->
    <main class="roster-content">
      <!-- 基础个人信息 -->
      <div v-show="activeCategory === 'basic'" class="roster-section">
        <div class="roster-section__title">
          基础个人信息
        </div>
        <div class="roster-form">
          <el-form :model="basicForm" label-width="90px" label-position="left">
            <el-row :gutter="120">
              <el-col :span="12">
                <el-form-item label="姓名">
                  <el-input v-model="basicForm.name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-select v-model="basicForm.gender" placeholder="请选择">
                    <el-option label="男" value="male" />
                    <el-option label="女" value="female" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生日期">
                  <el-date-picker v-model="basicForm.birthday" type="date" value-format="YYYY-MM-DD" placeholder="请选择" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="民族">
                  <el-input v-model="basicForm.nation" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号">
                  <el-input v-model="basicForm.idCard" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="婚姻状况">
                  <el-select v-model="basicForm.maritalStatus" placeholder="请选择">
                    <el-option label="未婚" value="unmarried" />
                    <el-option label="已婚" value="married" />
                    <el-option label="离异" value="divorced" />
                    <el-option label="丧偶" value="widowed" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="政治面貌">
                  <el-select v-model="basicForm.politicalStatus" placeholder="请选择">
                    <el-option label="群众" value="public" />
                    <el-option label="共青团员" value="youth" />
                    <el-option label="中共党员" value="party" />
                    <el-option label="民主党派" value="democratic" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="籍贯">
                  <el-input v-model="basicForm.birthPlace" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户籍">
                  <el-input v-model="basicForm.household" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="血型">
                  <el-select v-model="basicForm.bloodType" placeholder="请选择">
                    <el-option label="A型" value="A" />
                    <el-option label="B型" value="B" />
                    <el-option label="AB型" value="AB" />
                    <el-option label="O型" value="O" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身高(cm)">
                  <el-input v-model="basicForm.height" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="体重(kg)">
                  <el-input v-model="basicForm.weight" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="健康状况">
                  <el-input v-model="basicForm.healthStatus" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号">
                  <el-input v-model="basicForm.phone" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱">
                  <el-input v-model="basicForm.email" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="紧急联系人">
                  <el-input v-model="basicForm.emergencyContact" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="紧急联系电话">
                  <el-input v-model="basicForm.emergencyPhone" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 岗位与组织架构信息 -->
      <div v-show="activeCategory === 'job'" class="roster-section">
        <div class="roster-section__title">
          岗位与组织架构信息
        </div>
        <div class="roster-form">
          <el-form :model="jobForm" label-width="90px" label-position="left">
            <el-row :gutter="120">
              <el-col :span="12">
                <el-form-item label="工号">
                  <el-input v-model="jobForm.employeeNo" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属部门">
                  <el-input v-model="jobForm.department" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="岗位">
                  <el-input v-model="jobForm.position" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职级">
                  <el-input v-model="jobForm.jobLevel" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用工类型">
                  <el-select v-model="jobForm.employmentType" placeholder="请选择">
                    <el-option label="正式员工" value="regular" />
                    <el-option label="实习生" value="intern" />
                    <el-option label="外包" value="outsourced" />
                    <el-option label="劳务派遣" value="dispatch" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入职日期">
                  <el-date-picker v-model="jobForm.entryDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作地">
                  <el-input v-model="jobForm.workLocation" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作省份">
                  <el-input v-model="jobForm.workProvince" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作城市">
                  <el-input v-model="jobForm.workCity" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 薪酬与银行卡信息 -->
      <div v-show="activeCategory === 'payroll'" class="roster-section">
        <div class="roster-section__title">
          薪酬与银行卡信息
        </div>
        <div class="roster-form">
          <el-form :model="payrollForm" label-width="90px" label-position="left">
            <el-row :gutter="120">
              <el-col :span="12">
                <el-form-item label="薪资类型">
                  <el-select v-model="payrollForm.salaryType" placeholder="请选择">
                    <el-option label="月薪制" value="monthly" />
                    <el-option label="年薪制" value="yearly" />
                    <el-option label="日薪制" value="daily" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工资卡开户行">
                  <el-input v-model="payrollForm.salaryCardBank" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工资卡号">
                  <el-input v-model="payrollForm.salaryCardNo" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工资卡姓名">
                  <el-input v-model="payrollForm.salaryCardName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="社保账号">
                  <el-input v-model="payrollForm.socialSecurityNo" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公积金账号">
                  <el-input v-model="payrollForm.providentFundNo" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计税方式">
                  <el-select v-model="payrollForm.taxType" placeholder="请选择">
                    <el-option label="专项附加扣除" value="special" />
                    <el-option label="全年一次性奖金" value="annual" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 合同与履职信息 -->
      <div v-show="activeCategory === 'contract'" class="roster-section">
        <div class="roster-section__title">
          合同与履职信息
        </div>
        <div class="roster-form">
          <el-form :model="contractForm" label-width="90px" label-position="left">
            <el-row :gutter="120">
              <el-col :span="12">
                <el-form-item label="合同类型">
                  <el-select v-model="contractForm.contractType" placeholder="请选择">
                    <el-option label="固定期限" value="fixed" />
                    <el-option label="无固定期限" value="unlimited" />
                    <el-option label="以完成一定任务" value="task" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同起始日">
                  <el-date-picker v-model="contractForm.contractStart" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同截止日">
                  <el-date-picker v-model="contractForm.contractEnd" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同期限(年)">
                  <el-input v-model="contractForm.contractPeriod" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签订次数">
                  <el-input v-model="contractForm.signingTimes" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="首次合同日期">
                  <el-date-picker v-model="contractForm.firstContractDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="试用期">
                  <el-select v-model="contractForm.probationPeriod" placeholder="请选择">
                    <el-option label="无试用期" value="none" />
                    <el-option label="1个月" value="1" />
                    <el-option label="2个月" value="2" />
                    <el-option label="3个月" value="3" />
                    <el-option label="6个月" value="6" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="试用期结束日">
                  <el-date-picker v-model="contractForm.probationEndDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 动态列表类信息 -->
      <div v-show="activeCategory === 'dynamic'" class="roster-section">
        <div class="roster-section__title">
          动态列表类信息
        </div>

        <!-- 教育经历 -->
        <div class="list-block">
          <div class="list-block__header">
            <span class="list-block__title">教育经历</span>
            <el-button size="small" type="primary" @click="addEducation">
              + 添加
            </el-button>
          </div>
          <el-table :data="educationList" border style="width: 100%">
            <el-table-column prop="school" label="学校" min-width="160">
              <template #default="{ row }">
                <el-input v-model="row.school" />
              </template>
            </el-table-column>
            <el-table-column prop="major" label="专业" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.major" />
              </template>
            </el-table-column>
            <el-table-column prop="degree" label="学历" min-width="100">
              <template #default="{ row }">
                <el-select v-model="row.degree" placeholder="请选择">
                  <el-option label="高中" value="high" />
                  <el-option label="大专" value="college" />
                  <el-option label="本科" value="bachelor" />
                  <el-option label="硕士" value="master" />
                  <el-option label="博士" value="phd" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="startDate" label="开始日期" min-width="120">
              <template #default="{ row }">
                <el-date-picker v-model="row.startDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column prop="endDate" label="结束日期" min-width="120">
              <template #default="{ row }">
                <el-date-picker v-model="row.endDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60" fixed="right">
              <template #default="{ $index }">
                <el-button type="text" size="small" @click="removeEducation($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 工作经历 -->
        <div class="list-block">
          <div class="list-block__header">
            <span class="list-block__title">工作经历</span>
            <el-button size="small" type="primary" @click="addWork">
              + 添加
            </el-button>
          </div>
          <el-table :data="workList" border style="width: 100%">
            <el-table-column prop="company" label="公司" min-width="160">
              <template #default="{ row }">
                <el-input v-model="row.company" />
              </template>
            </el-table-column>
            <el-table-column prop="position" label="岗位" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.position" />
              </template>
            </el-table-column>
            <el-table-column prop="startDate" label="开始日期" min-width="120">
              <template #default="{ row }">
                <el-date-picker v-model="row.startDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column prop="endDate" label="结束日期" min-width="120">
              <template #default="{ row }">
                <el-date-picker v-model="row.endDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column prop="leavingReason" label="离职原因" min-width="160">
              <template #default="{ row }">
                <el-input v-model="row.leavingReason" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60" fixed="right">
              <template #default="{ $index }">
                <el-button type="text" size="small" @click="removeWork($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 家庭信息 -->
        <div class="list-block">
          <div class="list-block__header">
            <span class="list-block__title">家庭信息</span>
            <el-button size="small" type="primary" @click="addFamily">
              + 添加
            </el-button>
          </div>
          <el-table :data="familyList" border style="width: 100%">
            <el-table-column prop="name" label="姓名" min-width="100">
              <template #default="{ row }">
                <el-input v-model="row.name" />
              </template>
            </el-table-column>
            <el-table-column prop="relation" label="关系" min-width="100">
              <template #default="{ row }">
                <el-select v-model="row.relation" placeholder="请选择">
                  <el-option label="父亲" value="father" />
                  <el-option label="母亲" value="mother" />
                  <el-option label="配偶" value="spouse" />
                  <el-option label="子女" value="child" />
                  <el-option label="兄弟姐妹" value="sibling" />
                  <el-option label="其他" value="other" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="联系电话" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.phone" />
              </template>
            </el-table-column>
            <el-table-column prop="company" label="工作单位" min-width="160">
              <template #default="{ row }">
                <el-input v-model="row.company" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60" fixed="right">
              <template #default="{ $index }">
                <el-button type="text" size="small" @click="removeFamily($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 入职附件与影像资料 -->
      <div v-show="activeCategory === 'attachments'" class="roster-section">
        <div class="roster-section__title">
          入职附件与影像资料
        </div>
        <div class="roster-form">
          <el-form :model="attachments" label-width="90px" label-position="left">
            <el-row :gutter="120">
              <el-col :span="12">
                <el-form-item label="身份证正面">
                  <el-upload action="#" list-type="picture-card">
                    <i class="el-icon-plus" />
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证背面">
                  <el-upload action="#" list-type="picture-card">
                    <i class="el-icon-plus" />
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学历证书">
                  <el-upload action="#" list-type="picture-card">
                    <i class="el-icon-plus" />
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="毕业证书">
                  <el-upload action="#" list-type="picture-card">
                    <i class="el-icon-plus" />
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="体检证明">
                  <el-upload action="#" list-type="picture-card">
                    <i class="el-icon-plus" />
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证件照">
                  <el-upload action="#" list-type="picture-card">
                    <i class="el-icon-plus" />
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 自定义字段预留区 -->
      <div v-show="activeCategory === 'custom'" class="roster-section">
        <div class="roster-section__title">
          自定义字段预留区
        </div>
        <div class="roster-form">
          <el-form :model="customFields" label-width="90px" label-position="left">
            <el-row :gutter="120">
              <el-col :span="12">
                <el-form-item label="自定义字段1">
                  <el-input v-model="customFields.customField1" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="自定义字段2">
                  <el-input v-model="customFields.customField2" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="自定义字段3">
                  <el-input v-model="customFields.customField3" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="roster-footer">
        <el-button type="primary" :loading="saving" @click="submit">
          保存
        </el-button>
        <el-button>
          取消
        </el-button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.employee-roster {
  display: flex;
  height: 100%;
  background: #f6f8fb;
  gap: 0;
}

.roster-nav {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #eef1fb;
  flex-shrink: 0;
  overflow-y: auto;
}

.roster-nav__title {
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2333;
  border-bottom: 1px solid #eef1fb;
}

.roster-nav__list {
  list-style: none;
  padding: 12px 0;
  margin: 0;
}

.roster-nav__item {
  padding: 12px 24px;
  font-size: 14px;
  color: #6a7cb4;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.roster-nav__item:hover {
  color: #ff8714;
  background: #fff8f0;
}

.roster-nav__item.is-active {
  color: #ff8714;
  background: #fff8f0;
  border-left-color: #ff8714;
  font-weight: 500;
}

.roster-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.roster-section {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(15, 35, 95, 0.08);
  padding: 24px;
  margin-bottom: 16px;
}

.roster-section__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2333;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef1fb;
}

.roster-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.roster-form :deep(.el-form-item__label) {
  color: #6a7cb4;
  font-size: 13px;
  justify-content: flex-start;
  text-align: left;
}

.roster-form :deep(.el-form-item__content) {
  flex: 1;
  min-width: 0;
}

.roster-form :deep(.el-input__inner),
.roster-form :deep(.el-select) {
  height: 36px;
}

.roster-form :deep(.el-form-item .el-select),
.roster-form :deep(.el-form-item .el-date-editor.el-input) {
  width: 100%;
}

.list-block {
  margin-bottom: 24px;
}

.list-block:last-child {
  margin-bottom: 0;
}

.list-block__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.list-block__title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2333;
}

.roster-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 24px 0;
}

.roster-footer .el-button {
  height: 40px;
  width: 100px;
  border-radius: 20px;
}

.roster-footer .el-button--primary {
  background: #ff8714;
  border-color: #ff8714;
}

.roster-footer .el-button--primary:hover {
  background: #ff7714;
  border-color: #ff7714;
}
</style>
