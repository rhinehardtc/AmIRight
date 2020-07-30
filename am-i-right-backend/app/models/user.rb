class User < ApplicationRecord
  has_many :posts
  has_many :likes, through: :posts
  

  validates :name, uniqueness: true
end
