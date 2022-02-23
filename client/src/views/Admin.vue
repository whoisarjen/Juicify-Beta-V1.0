<template>
    <div style="display: grid;">
        <adminTable where="product"/>
    </div>
</template>

<script>
import adminTable from '@/components/admin/table'
export default {
    mounted(){
        if(this.$store.state.userToken.users_roles_ID !== 9999) this.$router.push('/404')
    },
    components: {adminTable}
}
</script>