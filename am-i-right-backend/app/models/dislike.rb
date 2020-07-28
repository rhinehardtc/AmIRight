class Dislike < ApplicationRecord
  belongs_to :user
  belongs_to :post

  validates :user, uniqueness: true
end
