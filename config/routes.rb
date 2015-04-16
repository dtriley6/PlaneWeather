Rails.application.routes.draw do

  match '/resolve/:location', to: 'location#resolve', via: 'get', constraints: { location: /[^\/^json]+/ }

  root 'dashboard#home'
end
