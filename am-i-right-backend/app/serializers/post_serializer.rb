class PostSerializer < ActiveModel::Serializer
  attributes :id, :content, :user_id
  has_many :likes
  belongs_to :user
  
end
