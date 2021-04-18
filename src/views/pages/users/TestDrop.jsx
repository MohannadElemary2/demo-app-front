import React, { useEffect, useState } from "react";


const TestDrop = async (search, loadedOptions, {page}) => {
  const response = await fetch(`http://mohannad.localhost:8000/api/v1/client/hubs?name=${search}&page=${page}&per_page=8`, {
    headers: {
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiNGJkNWMwNDA4OGY2ZGQyOTUzYjEyNzYxZjlmY2UwYTk3ZmI4NDdkZDBhM2ZlYzRjMjJhOGQ4ZWQyNGRlYWIwOWRkYmMzOTAyYzNjYTU3NzkiLCJpYXQiOjE2MTU5MDgxMDQsIm5iZiI6MTYxNTkwODEwNCwiZXhwIjoxNjQ3NDQ0MTA0LCJzdWIiOiIxIiwic2NvcGVzIjpbIioiXX0.J0kRVA4_Egpxou76DjIlPRPPrKLzh6ZstDXxg2VShKIgQLEzCVVOj6oAIQOia37RHqxCE53Op1d8Fxz_5Zhi845Lf3jNQHs9XP1-cSG4PitSvPKvGctbbybtqTJ4N1IlqHbLNf7IfpbC4naH5Q5UBzXIY3CpMfTN9nbaDug_08UsIWsnwfN5eJLCd0el39UmEphJkYNi9ZoeqEAHseIxZIYquUgSgE4eYQi8ap9E4vKWCZLAQz9BsBB_HpwGEmEP_M-GjNMoi-ApTFGG5XpLQetTdCA1gTySJgoWgxbn2QMeBo6Svu4P9gad4fCcnDuIECLTI7kSagcYq1B1W0nZ-SoLXWn3Z0eR6irquv7g8Sop-pnUbLcUdTo-Ip2ogrwgEMBOM-wD7ZiPu-hcOTdcqpMeVL9OHqDcNbNLU6pMkf70Z9tXAjOZifnzsCUy07YGwhE_G7YlQP95Gaw747H0PV9yfaddOvvrP4NZKR2RTs_bOCqVrwNZDhjMwxu-TZqu1o1VVtmVjuNClbxBorctjxiv5zWMTM4g5vrVxSWPJYU2s_cDNMYodtRNlAbldhUHJS7ryC-Ds56rnSL1pR8vB8biHAlNLefa5rn-x3AYwfHhsrA020-W7fqqCxJtU1FDi_g3pWHF8OyJgwQZGAqk9ova7VVXBZIHEN_pL4CeVlk',
      "accept" : 'application/json'
    }
  });
  const responseJSON = await response.json();

  return {
    options: responseJSON.data.map(ele => {
      return {
        value : ele.id,
        label : ele.name
      }
    }),
    hasMore: page < responseJSON.meta.last_page,
    additional: {
      page: page + 1,
    },
  };
};

export default TestDrop;
