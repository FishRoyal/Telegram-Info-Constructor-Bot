export function parseEntities(text: string | undefined, entities: any): string {
    if(typeof text === "undefined") return ""
    if(typeof entities === "undefined") return ""

    let end_tag_offset = 0;
    let privious_offset = -1;

    for(let i = entities.length - 1; i >= 0; i--) {

        const entity = entities[i];
        if(privious_offset !== entity.offset) {
            end_tag_offset = 0;
        }
        const rightBorder = entity.offset + entity.length + end_tag_offset - 1;
        let word;
        rightBorder >= text.length - 1 ? word = text.slice(entity.offset) : word = text.slice(entity.offset, rightBorder + 1);
        switch (entity.type) {
            case 'bold':
                word = "<b>" + word + "</b>"
                end_tag_offset = end_tag_offset + 7;
                break;
            case 'italic':
                word = "<i>" + word + "</i>"
                end_tag_offset = end_tag_offset + 7;
                break;
            case 'spoiler':
                word = '<span class="tg-spoiler">' + word  + '</span>';
                end_tag_offset = end_tag_offset + 13;
                break;
            case 'underline':
                word = "<u>" + word + "</u>"
                end_tag_offset = end_tag_offset + 7;
                break;
            case 'strikethrough':
                word = "<s>" + word + "</s>"
                end_tag_offset = end_tag_offset + 7;
                break;
            case 'text_link':
                word = '<a href="' + entity.url + '">' + word  + '</a>'
                end_tag_offset = end_tag_offset + 7;
                break;
            default:
                break;
        }

        rightBorder >= text.length - 1 ? text = text.slice(0, entity.offset) + word : text = text.slice(0, entity.offset) + word + text.slice(rightBorder + 1)
        console.log(text.slice(entity.offset))
        privious_offset = entity.offset;
    }
    return text;
}

