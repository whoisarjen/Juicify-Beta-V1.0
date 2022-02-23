<template>
    <div style="margin-bottom: 15px;">
        <div style="color: red; font-weight: bold; text-transform: uppercase;">{{this.$t("coach.warningMessage.warning")}}</div>
        <div>
            {{this.$t("coach.warningMessage.new_warning_1")}} <span style="text-decoration: underline;">{{this.$t("coach.warningMessage.new_warning_2")}} {{1300 - calories}}{{this.$t("coach.warningMessage.new_warning_3")}}</span> 
            {{this.$t("coach.warningMessage.new_warning_4")}} <i class="fas fa-book"></i> <i class="fas fa-long-arrow-alt-right"></i> <i class="fas fa-fire"></i></div>
    </div>
</template>

<script>
export default {
    props: {
        calories: [Number, String]
    }
}
</script>