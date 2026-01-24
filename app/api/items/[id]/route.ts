import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

// Initialize DynamoDB client with AWS SDK v3
const region = process.env.AWS_REGION || 'ap-southeast-6'
const tableName = process.env.DYNAMODB_TABLE_NAME || 'feijoa-stack-table'

const client = new DynamoDBClient({ 
  region,
  // SDK v3 automatically uses EKS Pod Identity credentials via environment variables
})

const docClient = DynamoDBDocumentClient.from(client)

// GET /api/items/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const command = new GetCommand({
      TableName: tableName,
      Key: { id },
    })
    
    const result = await docClient.send(command)
    
    return NextResponse.json(result.Item || null)
  } catch (error: any) {
    console.error('Error getting item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get item' },
      { status: 500 }
    )
  }
}

// POST /api/items/:id
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    // Build update expression
    const updateExpressions: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}
    
    Object.entries(data).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`)
      expressionAttributeNames[`#${key}`] = key
      expressionAttributeValues[`:${key}`] = value
    })
    
    const command = new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
    
    const result = await docClient.send(command)
    
    return NextResponse.json(result.Attributes)
  } catch (error: any) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update item' },
      { status: 500 }
    )
  }
}
