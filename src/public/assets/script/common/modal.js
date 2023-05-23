/**
 * 모달 제어
 */
export const modal = {

    /**
     * 모달 팝업 생성
     * @param {*} targetId 
     * @param {*} parameter 
     * @returns 
     */
    create: (targetId, parameter) => new Modal(targetId, parameter)
}

/**
 * 모달 객체
 */
class Modal {
    // 생성자
    constructor(openId, closeId, option){
        
        // 모달의 타켓
        this.modalTarget = document.getElementById(openId);
        // 모달의 닫기 타겟
        this.closeTarget = document.getElementById(closeId);

        /**
         * 옵션 세팅
         */
        // z-index 세팅
        if(option?.zIndex){
            this.modalTarget.style.zIndex = option.zIndex;
        }
        // open 콜백 세팅
        if(option?.beforeOpenFn && typeof option.beforeOpenFn == 'function'){
            this.beforeOpenFn = option.beforeOpenFn;
        }
        if(option?.afterOpenFn && typeof option.afterOpenFn == 'function'){
            this.afterOpenFn = option.afterOpenFn;
        }
        // close 콜백 세팅
        if(option?.beforeCloseFn && typeof option.beforeCloseFn == 'function'){
            this.beforeCloseFn = option.beforeCloseFn;
        }
        if(option?.afterCloseFn && typeof option.afterCloseFn == 'function'){
            this.afterCloseFn = option.afterCloseFn;
        }


        // 닫기 이벤트 생성
        this.closeTarget.addEventListener('click', e => this.close(e));

        

        // const openModalButton = document.getElementById("openModal");
        // const modal = document.getElementById("modal");
        // const closeModalButton = document.getElementById("closeModal");

        // openModalButton.addEventListener("click", () => {
        //   modal.style.display = "block";
        // });

        // closeModalButton.addEventListener("click", () => {
        //   modal.style.display = "none";
        // });

        // window.addEventListener("click", (event) => {
        //   if (event.target === modal) {
        //     modal.style.display = "none";
        //   }
        // });


    }

    /**
     * 모달팝업 열기
     */
    open = () => {

        // 모달창 열기 전 콜백함수 호출
        if(typeof this.beforeOpenFn === 'function'){
            this.beforeOpenFn();
        }
        // 모달팝업 표시
        this.modalTarget.classList.add('on');

        // 모달창 표시 후 콜백함수 호출
        if(typeof this.afterOpenFn === 'function'){
            this.afterOpenFn();
        }
    }

    /**
     * 모달팝업 닫기
     */
    close = () => {

        // 모달창 열기 전 콜백함수 호출
        if(typeof this.beforeCloseFn === 'function'){
            this.beforeCloseFn();
        }

        // 모달팝업 표시
        this.modalTarget.classList.remove('on');

        // 모달창 표시 후 콜백함수 호출
        if(typeof this.afterCloseFn === 'function'){
            this.afterCloseFn();
        }
    }
}