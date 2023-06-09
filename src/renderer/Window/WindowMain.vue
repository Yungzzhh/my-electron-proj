<script setup lang='ts'>
import { ipcRenderer } from "electron";
import { onMounted } from "vue";
onMounted(() => {
  ipcRenderer.invoke("showWindow");
});
</script>

<template>
    <div>
        <router-view></router-view>
    </div>
</template>

