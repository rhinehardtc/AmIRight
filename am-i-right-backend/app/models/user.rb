class User < ApplicationRecord
  has_many :posts
  has_many :likes, through: :posts
  has_many :dislikes, through: :posts

  validates :name, uniqueness: true
end
