import { Repository } from 'typeorm';
import { Media } from './media.entity';
export declare class MediaService {
    private mediaRepository;
    constructor(mediaRepository: Repository<Media>);
    findAll(): Promise<Media[]>;
}
