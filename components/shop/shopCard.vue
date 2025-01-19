<template>
  <el-card class="!border-none rounded-md hover:shadow-lg transition-all duration-300">
    <template>
      <div class="flex gap-3">
        <div class="w-24 h-24 object-cover rounded-md overflow-hidden flex-shrink-0">
          <thumbnail-img :url="shop.shop_logo" :title="shop.shop_name" :alt="shop.shop_name" class="w-full" />
        </div>

        <div>
          <!-- 店铺信息 -->
          <span class="flex items-center gap-2">
            <span class="icon-[mingcute--shopping-bag-1-line]" style="width: 20px; height: 20px;" />
            <h2 class="text-[14px] font-bold text-gray-800 mb-2">{{ shop.shop_name }}</h2>
          </span>
          <span class="flex items-center gap-2">
            <span class="icon-[mingcute--location-2-line] flex-shrink-0" style="width: 20px; height: 20px;" />
            <span class="text-[14px] text-gray-600">
              <span v-if="shop.shop_country === 0" class="border-b-2 border-red-500"><span class="text-xl">🇨🇳</span> 国牌</span>
              <span v-else><span class="text-xl">🇯🇵</span> 日牌</span>
            </span>
          </span>
        </div>
      </div>
    </template>
  </el-card>
</template>
<script>
export default {
  props: {
    shop: {
      type: Object,
      required: true
    }
  }
}
</script>
