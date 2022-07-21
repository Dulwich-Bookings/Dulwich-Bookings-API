import {
  BookmarkAttributes,
  BookmarkCreationAttributes,
} from '../models/Bookmark';
import BookmarkRepository from '../repositories/BookmarkRepository';
import Bookmark from '../models/Bookmark';
import {TransactionOptions} from '../repositories/BaseRepository';

export default class BookmarkService {
  private bookmarkRepository: BookmarkRepository;

  constructor(bookmarkRepository: BookmarkRepository) {
    this.bookmarkRepository = bookmarkRepository;
  }

  async createOneBookmark(
    bookmark: BookmarkCreationAttributes,
    options?: TransactionOptions
  ) {
    return (await this.bookmarkRepository.createOne(
      bookmark,
      options
    )) as Bookmark;
  }

  async getAllBookmarks() {
    return (await this.bookmarkRepository.getAll()) as Bookmark[];
  }

  async getOneBookmarkById(id: number) {
    return (await this.bookmarkRepository.getWithFilters({id}))[0] as Bookmark;
  }

  async getBookmarksByUserId(userId: number) {
    return (await this.bookmarkRepository.getWithFilters({
      userId,
    })) as Bookmark[];
  }

  async updateOneBookmarkById(
    id: number,
    attrs: BookmarkAttributes,
    options?: TransactionOptions
  ) {
    return (await this.bookmarkRepository.updateOne(
      attrs,
      {
        id,
      },
      options
    )) as Bookmark;
  }

  async deleteOneBookmarkById(id: number, options?: TransactionOptions) {
    return this.bookmarkRepository.deleteOne({id}, options);
  }
}
