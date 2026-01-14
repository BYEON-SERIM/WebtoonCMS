import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    isOpen: false,
    title: '',
    message: '',
    resolve: null,
  }),
  actions: {
    confirm(title, message) {
      this.title = title
      this.message = message
      this.isOpen = true
      
      return new Promise((res) => {
        this.resolve = res
      })
    },
    //확인 시 호출
    handleAction(value) {
      this.isOpen = false
      if (this.resolve) this.resolve(value) // true 또는 false 반환
    }
  }
})