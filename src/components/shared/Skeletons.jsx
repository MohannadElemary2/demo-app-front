import React from "react";
import Skeleton from "react-loading-skeleton";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import { listValues } from "../../utility/constants";

export const LabelSkeleton = React.memo(({ width = 200, ...rest }) => (
  <Skeleton className="d-block mb-2" width={width} {...rest} />
));

export const InputGroupSkeleton = React.memo(({ ...rest }) => (
  <div className="mb-3" {...rest}>
    <Skeleton className="d-block mb-2" width={200} />
    <Skeleton className="d-block" height={35} />
  </div>
));
export const ButtonSkeleton = React.memo(({ width = 120, ...rest }) => (
  <Skeleton {...rest} height={35} width={width} />
));

export const FormButtonsSkeleton = React.memo(() => (
  <>
    <ButtonSkeleton className="mr-2" />
    <ButtonSkeleton />
  </>
));

export const ListSkeleton = React.memo(() => (
  <div className="data-list list-view p-2">
    <div className="d-flex justify-content-between">
      {[...Array(4)].map((ele, i) => (
        <LabelSkeleton key={JSON.stringify(i)} height={25} />
      ))}
    </div>
    {[...Array(listValues.PER_PAGE)].map((ele, i) => (
      <Skeleton className="box-shadow-1 mb-3" key={JSON.stringify(i)} height={70} />
    ))}
  </div>
));

export const CardSkeletons = React.memo(() => (
  <div className="d-flex flex-wrap justify-content-between">
    {[...Array(1)].map((ele, i) => (
      <Card key={JSON.stringify(i)}>
        <CardHeader>
          <LabelSkeleton />
        </CardHeader>
        <CardBody>
          <Skeleton height={130} width={330} />
        </CardBody>
      </Card>
    ))}
  </div>
));
