Rails.application.routes.draw do

  match '/resolve/:location', to: 'location#resolve', via: 'get', constraints: { location: /[^\/^json]+/ }, defaults: {format: :json}

  match '/forecast/:origin/:destination/:departure/:speed/:interval', to: 'forecast#calculate',
    via: 'get', constraints: { origin: /[^\/^json]+/, destination: /[^\/^json]+/, departure: /.*/ }, defaults: {format: :json}
   

  root 'dashboard#home'
end
