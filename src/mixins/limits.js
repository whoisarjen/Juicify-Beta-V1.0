export default{
    data: () => ({
        inputTEXTrequested: [],
        inputTEXTpassword: [],
        inputTEXToptionalSHORT: [],
        inputTEXToptional: [],
        inputEMAIL: [],
        basicNumberSecurity: [],
        basicNumberSecurityOver0: [],
        valueCanNotBe0: []
    }),
    async mounted(){
        this.inputTEXTrequested = [ // titles / etc required
            v => v.length > 2 || this.$t('error_notify.require_at_least_3_chars'),
            v => v.length < 61 || this.$t('error_notify.max_number_of_characters_60'),
            v => v.toLowerCase().indexOf("admin") === -1 || this.$t('error_notify.not_available_word') + ' "Admin"!'
        ]
        this.inputTEXTpassword = [ // passwords
            v => v.length > 2 || this.$t('error_notify.require_at_least_3_chars'),
            v => v.length < 256 || this.$t('error_notify.max_number_of_characters_255')
        ]
        this.inputTEXToptionalSHORT = [ // names etc / not required
            v => v.length < 61 || this.$t('error_notify.max_number_of_characters_60'),
            v => v.toLowerCase().indexOf("admin") === -1 || this.$t('error_notify.not_available_word') + ' "Admin"!'
        ]
        this.inputTEXToptional = [ // descriptions
            v => v.length < 101 || this.$t('error_notify.max_number_of_characters_100')
        ]
        this.inputEMAIL = [ // Veryfication email's input 
            v => !!v || this.$t('error_notify.required'),
            v => v.length < 256 || this.$t('error_notify.max_number_of_characters_255'),
            v => /.+@.+/.test(v) || this.$t('error_notify.email_not_valid'),
        ]
        this.basicNumberSecurity = [
            v => v >= 0 || this.$t('error_notify.required'),
            v => v < 100000 || this.$t('error_notify.max_number_100000')
        ]
        this.basicNumberSecurityOver0 = [
            v => v > 0 || this.$t('error_notify.required'),
            v => v < 100000 || this.$t('error_notify.max_number_100000')
        ]
        this.valueCanNotBe0 = [
            v => v != 0 || this.$t('error_notify.can_not_be_0')
        ]
    }
}