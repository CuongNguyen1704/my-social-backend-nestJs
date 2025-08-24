
export enum FRIEND_REQUEST_STATUS {
    PENDING = 'pending', // đã gửi chờ phản hồi
    ACCEPTED = 'accepted', // đã chấp nhận
    REJECT = 'reject', // đã từ chối lời mời
    CANCEL = 'cancel' // đã gửi lời mời xong lại hủy
}

export enum FRIEND_SHIP_STATUS {
    ACTIVE = 'active',
    BLOCKED = 'blocked',
    UNFRIENDED = 'unfriended'
}