export type Position = { x:number; y:number; display:'avatar'|'collapsed'|'hidden'; dock:boolean; version:1 };
export const initialPosition:Position = {x:1,y:1,display:'avatar',dock:true,version:1};
const unit=(n:number)=>Math.max(0,Math.min(1,n));
export function readPosition(raw:string|null):Position {
    try { const p=JSON.parse(raw || 'null');
        if(p?.version===1 && Number.isFinite(p.x) && Number.isFinite(p.y) && ['avatar','collapsed','hidden'].includes(p.display) && typeof p.dock==='boolean')
            return {...initialPosition,x:unit(p.x),y:unit(p.y),display:p.display,dock:p.dock};
    } catch { /* Storage can be disabled or corrupted. */ }
    return {...initialPosition};
}
export function positionBounds(width:number,height:number,offsetX=0,offsetY=0) {
    const left=offsetX+Math.min(16,Math.max(0,width-80)), top=offsetY+Math.min(80,Math.max(8,height-120));
    return {left,top,width:Math.max(0,width-112),height:Math.max(0,height-(top-offsetY)-128)};
}
export function normalizedPosition(x:number,y:number,b:ReturnType<typeof positionBounds>,dock:boolean) {
    const nx=b.width ? unit((x-b.left)/b.width) : 0, ny=b.height ? unit((y-b.top)/b.height) : 0;
    return {x:dock ? (nx<.5?0:1) : nx,y:ny};
}
export type GuideStep={title:string;text:string;target?:string};
export function pageGuide(page:string):GuideStep[] {
    if(page==='reading') return [
        {title:'Đọc bài trước',text:'Đọc theo từng đoạn. Nút đánh dấu giúp bạn lưu đoạn cần xem lại.',target:'[data-guide="passage"]'},
        {title:'Lưu cụm từ',text:'Chọn cụm từ rồi bấm “Dùng phần đã chọn”, hoặc nhập bằng bàn phím. Xác nhận nghĩa trước khi lưu.',target:'#context-vocabulary'},
        {title:'Trả lời và dùng gợi ý',text:'Gửi từng câu để đối chiếu dẫn chứng. Gợi ý được ghi nhận riêng với câu trả lời.',target:'[data-guide="questions"]'},
        {title:'Giữ điều muốn nhớ',text:'Ghi chú được lưu tự động. Hoàn thành tất cả câu hỏi rồi chọn Hoàn thành buổi đọc.',target:'#note'}];
    if(page==='vocabulary') return [
        {title:'Ôn thẻ đến hạn',text:'Lật thẻ, tự đối chiếu nghĩa rồi chọn mức nhớ. Lịch ôn chỉ đổi khi bạn bấm chọn.',target:'[data-guide="vocabulary"]'},
        {title:'Quay về nguồn',text:'Mở một thẻ trong sổ từ và chọn Mở ngữ cảnh gốc để xem lại bài đọc.'},
        {title:'Kiểm tra lịch sử',text:'Các lần ôn đã lưu nằm ở cuối trang. Bạn có thể xuất đầy đủ trong Hồ sơ & riêng tư.'}];
    return [
        {title:'Chọn bước học',text:'Khám phá bài đọc để bắt đầu, hoặc vào Thư viện để tiếp tục buổi đang học.'},
        {title:'Ôn rồi ghi nhận',text:'Từ vựng lưu cụm từ và lịch ôn. Tổng quan phản ánh các nhiệm vụ đã lưu.'},
        {title:'Bạn giữ quyền lựa chọn',text:'Hồ sơ & riêng tư cho phép xem đồng ý, xuất và xóa dữ liệu. Companion có thể tắt bất cứ lúc nào.'}];
}
